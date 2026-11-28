import { createFileRoute } from "@tanstack/react-router";
import { chatInput } from "@/lib/ai-input";
import { getFreeAssistantReply, getFreeProviderUnavailableReply } from "@/lib/free-assistant";

const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
const LIMIT = 20; // requests per minute per visitor
const hits = new Map<string, number[]>();

const LANG_RULE: Record<string, string> = {
  auto: "Reply in the same language and script the user writes in (Urdu, Hindi, English or Roman Urdu).",
  ur: "Always reply in Urdu using Urdu (Nastaliq/Arabic) script.",
  hi: "Always reply in Hindi using Devanagari script.",
  pa: "Always reply in Punjabi. Use Gurmukhi script unless the user writes in Shahmukhi.",
  en: "Always reply in simple English.",
  "roman-ur": "Always reply in Roman Urdu (Urdu written with English letters).",
};

const MANAGER = `
BUSINESS MANAGER MODE: You are AI-Buddy's practical business operating assistant for small businesses in Pakistan. The product has three core customer-facing departments:
1) ACCOUNTS & STOCK: record sales, expenses, credit/udhaar, payments, purchases and stock; calculate totals and profit only from supplied records; flag missing information and never invent transactions.
2) BUSINESS MARKETING MANAGER (a major differentiator): work like an affordable marketing manager for a small shop, not merely a caption writer. Ask about product, target customer, location, budget and business goal when needed. Create a practical marketing strategy, campaign calendar, offer, channel plan, ad copy, Urdu/Roman Urdu posts, short-video scripts, creative briefs, customer acquisition ideas and a simple way to measure inquiries, orders, spend and sales. Explain low-budget options and distinguish organic content from paid advertising. Never promise guaranteed reach, virality or sales.
3) ORDERS & CUSTOMER CARE: organize order details, prepare customer confirmations, identify incomplete addresses or missing details, track COD dispatch/return status from owner-provided data, draft complaint replies and maintain clear follow-up lists. Do not claim to verify identity, address or payment unless a real connected service confirms it.
When drafting a reply to a customer message, use only the business facts included in the request. Never invent stock, prices, delivery promises, refunds, discounts or policies. If the answer depends on missing facts, prepare a polite short reply that says the owner will confirm, or ask one clear question. Clearly label drafts as drafts and never say a message was sent.
For every request, provide a complete, usable deliverable with simple steps, PKR cost awareness and measurable next actions. Support Urdu, Hindi, Roman Urdu, Punjabi and English. A separate AI-Buddy company-growth workflow may research public business information and draft relevant introductions, but must not claim live prospect discovery without a search connection or send unsolicited bulk messages. Use consent-based outreach and applicable platform rules. Never claim to have posted, contacted customers, searched live leads, spent money or changed accounts unless a connected tool confirms it. Ask the owner before external messages, publishing, ads, purchases or sharing customer data. Protect customer privacy. If details are missing, ask one important question at a time. Be honest about provider keys, integrations and human actions still required.`;

const GAME = `
GAMING ASSISTANT MODE: You are an expert gamer friend. Answer questions about mobile and PC games (PUBG, Free Fire, Minecraft, Clash of Clans, Ludo, FIFA, etc.): tips, strategies, controls, settings, characters, levels. When a game screenshot is shared, read the HUD, map, health, items and scores and give specific, practical advice for what to do next. Never help with cheats, hacks, mods that break rules, or account selling; suggest fair play.`;

function system(lang: string, memories: string[], mode?: string) {
  const mem = memories.length ? `\nThings the user asked you to remember about them:\n- ${memories.join("\n- ")}` : "";
  return `You are AI-Buddy, a friendly, respectful, patient female personal assistant.
Many users cannot read or write English well. Use very simple words, short sentences and numbered step-by-step guidance.
${LANG_RULE[lang] ?? LANG_RULE["auto"]}
When the user shares a screenshot or photo, carefully read the visible text and buttons, explain what the screen shows, and tell them exactly which button to press, describing its position (top, bottom, left, right) and its label.
Never claim you can see the user's phone screen unless an image is included in this message. You cannot control other apps; you can only guide.
Do not ask users for passwords, OTP codes or bank details; warn them kindly if they share such info. Keep answers short unless more detail is asked. Avoid markdown tables.
You are also an expert guide for Android phones and websites: give numbered steps naming the exact Settings menus and buttons.${mem}${mode === "game" ? GAME : mode === "manager" ? MANAGER : ""}`;
}

type InMsg = { role: "user" | "assistant"; text: string; image?: string };

function toGeminiContents(messages: InMsg[]) {
  const lastImage = messages.map((message) => Boolean(message.image)).lastIndexOf(true);
  return messages.map((message, index) => {
    const parts: Array<Record<string, unknown>> = [];
    if (message.text.trim()) parts.push({ text: message.text });
    if (message.image && index === lastImage) {
      const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(message.image);
      if (match) parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }
    if (!parts.length) parts.push({ text: "(image)" });
    return { role: message.role === "assistant" ? "model" : "user", parts };
  });
}

function openAICompatibleStream(upstream: ReadableStream<Uint8Array>) {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let finished = false;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (!finished) {
        const { value, done } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          finished = true;
          for (const line of buffer.split("\n")) emit(line, controller);
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) emit(line, controller);
        if (buffer.length > 1_000_000) {
          finished = true;
          controller.error(new Error("AI stream frame was too large."));
          await reader.cancel();
          return;
        }
        // Return after each upstream chunk so the browser can render partial text.
        if (value.length) return;
      }
    },
    async cancel(reason) {
      finished = true;
      await reader.cancel(reason);
    },
  });

  function emit(line: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const raw = trimmed.slice(5).trim();
    if (!raw || raw === "[DONE]") return;
    try {
      const event = JSON.parse(raw) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = event.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
      if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`));
    } catch {
      // Ignore non-JSON keep-alive or incomplete event lines.
    }
  }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0] ||
          "anon";
        const now = Date.now();
        for (const [visitor, times] of hits) if (!times.some((t) => now - t < 60_000)) hits.delete(visitor);
        const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
        if (recent.length >= LIMIT) {
          return Response.json({ error: "You are sending messages too fast. Please wait one minute." }, { status: 429 });
        }
        recent.push(now);
        hits.set(ip, recent);

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "Bad request." }, { status: 400 });
        }
        const parsed = chatInput.safeParse(raw);
        if (!parsed.success) return Response.json({ error: "Please check your message or image and try again." }, { status: 400 });
        const body = parsed.data;
        const msgs = body.messages.slice(-16) as InMsg[];
        if (!msgs.length || msgs[msgs.length - 1]?.role !== "user")
          return Response.json({ error: "Please type a message." }, { status: 400 });
        for (const message of msgs) {
          if (typeof message.text !== "string" || message.text.length > 4000)
            return Response.json({ error: "Message is too long." }, { status: 400 });
          if (message.image && (message.image.length > 6_000_000 || !message.image.startsWith("data:image/")))
            return Response.json({ error: "Image is too large or not valid." }, { status: 400 });
        }

        const geminiKey = process.env["GEMINI_API_KEY"];
        const lovableKey = process.env["LOVABLE_API_KEY"];
        const latestUserMessage = [...msgs].reverse().find((message) => message.role === "user");
        const hasImage = msgs.some((message) => Boolean(message.image));
        const freeReply = latestUserMessage && !hasImage && body.mode !== "game" && body.mode !== "manager"
          ? getFreeAssistantReply(latestUserMessage.text, body.lang ?? "auto")
          : null;
        const hasProvider = Boolean(geminiKey || lovableKey);
        const localReply = freeReply ?? (!hasProvider && latestUserMessage && !hasImage && body.mode !== "game" && body.mode !== "manager"
          ? getFreeProviderUnavailableReply(body.lang ?? "auto")
          : null);

        // Basic app FAQs are answered locally without using any AI provider.
        if (localReply) {
          const payload = `data: ${JSON.stringify({ choices: [{ delta: { content: localReply } }] })}\n\ndata: [DONE]\n\n`;
          return new Response(payload, {
            headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
          });
        }
        if (!geminiKey && !lovableKey) return Response.json({ error: "AI is not configured." }, { status: 503 });

        const memories = Array.isArray(body.memories)
          ? body.memories.filter((value): value is string => typeof value === "string").slice(0, 20).map((value) => value.slice(0, 200))
          : [];
        const systemPrompt = system(body.lang ?? "auto", memories, body.mode);

        // Prefer a server-side Gemini key when configured. The key is never sent to the browser.
        if (geminiKey) {
          const model = process.env["GEMINI_MODEL"] || DEFAULT_GEMINI_MODEL;
          let upstream: Response;
          try {
            upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: toGeminiContents(msgs),
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
              }),
              signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
            });
          } catch {
            if (request.signal.aborted) return new Response(null, { status: 499 });
            return Response.json({ error: "AI-Buddy could not connect to Gemini. Please try again." }, { status: 502 });
          }
          if (!upstream.ok || !upstream.body) {
            const status = upstream.status === 429 ? 429 : upstream.status === 400 ? 400 : upstream.status === 403 ? 403 : 502;
            return Response.json({
              error: status === 429
                ? "Gemini is busy or its usage limit has been reached. No other provider will be charged automatically."
                : status === 403
                  ? "Gemini access is not enabled for this key or project."
                  : "Gemini could not answer. Please check the server-side key and model settings.",
            }, { status });
          }
          return new Response(openAICompatibleStream(upstream.body), {
            headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
          });
        }

        // Backward-compatible Lovable gateway support. No silent provider switching.
        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${lovableKey}`,
              "Content-Type": "application/json",
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "google/gemini-3.8-flash",
              stream: true,
              messages: [
                { role: "system", content: systemPrompt },
                ...msgs.map((message) => message.image
                  ? { role: message.role, content: [{ type: "text", text: message.text || "Please explain this screen step by step." }, { type: "image_url", image_url: { url: message.image } }] }
                  : { role: message.role, content: message.text || "(image)" }),
              ],
            }),
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
          });
        } catch {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return Response.json({ error: "AI-Buddy could not connect to the AI service. Please try again." }, { status: 502 });
        }
        if (!upstream.ok || !upstream.body) {
          const map: Record<number, string> = {
            429: "AI-Buddy is busy right now. Please try again in a minute.",
            402: "The configured AI usage is finished. The app owner must review the provider balance.",
            403: "AI access is blocked for this app right now.",
          };
          return Response.json({ error: map[upstream.status] ?? "AI-Buddy could not answer. Please try again." }, { status: upstream.status });
        }
        return new Response(upstream.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
