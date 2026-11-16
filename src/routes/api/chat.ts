import { createFileRoute } from "@tanstack/react-router";
import { chatInput } from "@/lib/ai-input";

const MODEL = "google/gemini-3.8-flash";
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

const MANAGER = `\\nBUSINESS MANAGER MODE: You are the real AI business manager inside AI-Buddy. Act as a practical chief-of-staff for a small business in Pakistan. First understand the goal, then give a short action plan, draft ready-to-use posts/replies/offers, simple PKR cost awareness, and measurable next steps. Support Urdu, Hindi, Roman Urdu, Punjabi and English. Never claim to have posted, contacted customers, searched live leads, spent money, or changed accounts unless a connected tool actually confirms it. Never promise virality or guaranteed sales. Ask for owner approval before external messages, publishing, ads, purchases, or sharing customer data. Protect privacy; use only consented customer information. If details are missing, ask one important question at a time. Be honest when a task needs a social account connection or human action.`;\n\nconst GAME = "\nGAMING ASSISTANT MODE: You are an expert gamer friend. Answer questions about mobile and PC games (PUBG, Free Fire, Minecraft, Clash of Clans, Ludo, FIFA, etc.): tips, strategies, controls, settings, characters, levels. When a game screenshot is shared, read the HUD, map, health, items and scores and give specific, practical advice for what to do next. Never help with cheats, hacks, mods that break rules, or account selling; suggest fair play.";

function system(lang: string, memories: string[], mode?: string) {
  const mem = memories.length ? `\nThings the user asked you to remember about them:\n- ${memories.join("\n- ")}` : "";
  return `You are AI-Buddy, a friendly, respectful, patient female personal assistant created for Ashraf's AI-Buddy app.
Many users cannot read or write English well. Use very simple words, short sentences and numbered step-by-step guidance.
${LANG_RULE[lang] ?? LANG_RULE["auto"]}
When the user shares a screenshot or photo, carefully read the visible text and buttons, explain what the screen shows, and tell them exactly which button to press, describing its position (top, bottom, left, right) and its label.
Never claim you can see the user's phone screen unless an image is included in this message. You cannot control other apps; you can only guide.
Do not ask users for passwords, OTP codes or bank details; warn them kindly if they share such info. Keep answers short unless more detail is asked. Avoid markdown tables.
You are also an expert guide for Android phones and websites: give numbered steps naming the exact Settings menus and buttons.${mem}${mode === "game" ? GAME : mode === "manager" ? MANAGER : ""}`;
}

type InMsg = { role: "user" | "assistant"; text: string; image?: string };

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
          return Response.json(
            { error: "You are sending messages too fast. Please wait one minute." },
            { status: 429 },
          );
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
        const msgs = body.messages.slice(-16);
        if (!msgs.length || msgs[msgs.length - 1]?.role !== "user")
          return Response.json({ error: "Please type a message." }, { status: 400 });
        for (const m of msgs) {
          if (typeof m.text !== "string" || m.text.length > 4000)
            return Response.json({ error: "Message is too long." }, { status: 400 });
          if (m.image && (m.image.length > 6_000_000 || !m.image.startsWith("data:image/")))
            return Response.json({ error: "Image is too large or not valid." }, { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI is not configured." }, { status: 500 });

        // Only the latest image is sent; older images are dropped to save usage.
        const lastImg = msgs.map((m) => !!m.image).lastIndexOf(true);
        const messages = [
          { role: "system", content: system(body.lang ?? "auto", Array.isArray(body.memories) ? body.memories.filter((x): x is string => typeof x === "string").slice(0, 20).map((x) => x.slice(0, 200)) : [], body.mode) },
          ...msgs.map((m, i) =>
            m.image && i === lastImg
              ? {
                  role: m.role,
                  content: [
                    { type: "text", text: m.text || "Please explain this screen step by step." },
                    { type: "image_url", image_url: { url: m.image } },
                  ],
                }
              : { role: m.role, content: m.text || "(image)" },
          ),
        ];

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({ model: MODEL, stream: true, messages }),
            // Stop abandoned requests and prevent a stuck provider call from hanging forever.
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
          });
        } catch {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return Response.json({ error: "AI-Buddy could not connect to the AI service. Please try again." }, { status: 502 });
        }

        if (!upstream.ok || !upstream.body) {
          const map: Record<number, string> = {
            429: "AI-Buddy is busy right now. Please try again in a minute.",
            402: "The free AI usage for this month is finished. The app owner needs to add credits.",
            403: "AI access is blocked for this app right now.",
          };
          return Response.json(
            { error: map[upstream.status] ?? "AI-Buddy could not answer. Please try again." },
            { status: upstream.status },
          );
        }
        return new Response(upstream.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
