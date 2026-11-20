import { createFileRoute } from "@tanstack/react-router";
import { songInput } from "@/lib/ai-input";

const hits = new Map<string, number[]>();

export const Route = createFileRoute("/api/song")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "anon";
        const now = Date.now();
        for (const [visitor, times] of hits) if (!times.some((t) => now - t < 60_000)) hits.delete(visitor);
        const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
        if (recent.length >= 5)
          return Response.json({ error: "Please wait one minute before making another song." }, { status: 429 });
        recent.push(now);
        hits.set(ip, recent);

        let raw: unknown;
        try { raw = await request.json(); } catch { return Response.json({ error: "Bad request." }, { status: 400 }); }
        const parsed = songInput.safeParse(raw);
        if (!parsed.success) return Response.json({ error: "Please check your song description and choices." }, { status: 400 });
        const b = parsed.data;
        const idea = (b.idea ?? "").trim().slice(0, 1000);
        if (!idea) return Response.json({ error: "Please describe your song." }, { status: 400 });
        const lang = ["Urdu", "Hindi", "Punjabi", "English"].includes(b.lang ?? "") ? b.lang : "Urdu";
        const style = String(b.style ?? "romantic").slice(0, 30);
        const voice = b.voice === "male" ? "male" : "female";
        const systemPrompt = "You are a gifted songwriter. Write fully original song lyrics (never copy existing songs). Output only: a title line, then labelled sections [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus]. No markdown symbols.";
        const userPrompt = `Language: ${lang} (use its native script; for Punjabi use Shahmukhi or Gurmukhi as fits). Style: ${style}. Singer: ${voice} voice. Song idea: ${idea}`;

        const geminiKey = process.env["GEMINI_API_KEY"];
        const lovableKey = process.env["LOVABLE_API_KEY"];
        if (!geminiKey && !lovableKey) return Response.json({ error: "AI is not configured." }, { status: 503 });

        let lyrics = "";
        if (geminiKey) {
          const model = process.env["GEMINI_MODEL"] || "gemini-3.8-flash";
          let response: Response;
          try {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
              }),
              signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
            });
          } catch {
            if (request.signal.aborted) return new Response(null, { status: 499 });
            return Response.json({ error: "AI-Buddy could not connect to Gemini. Please try again." }, { status: 502 });
          }
          if (!response.ok) {
            const status = response.status === 429 ? 429 : response.status === 403 ? 403 : 502;
            return Response.json({
              error: status === 429
                ? "Gemini is busy or its usage limit has been reached. No other provider will be charged automatically."
                : status === 403
                  ? "Gemini access is not enabled for this key or project."
                  : "Gemini could not create the lyrics. Please check the server-side key and model settings.",
            }, { status });
          }
          const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
          lyrics = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim() ?? "";
        } else {
          let response: Response;
          try {
            response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
              body: JSON.stringify({
                model: "google/gemini-3.8-flash",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
              }),
              signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
            });
          } catch {
            if (request.signal.aborted) return new Response(null, { status: 499 });
            return Response.json({ error: "AI-Buddy could not connect to the AI service. Please try again." }, { status: 502 });
          }
          if (!response.ok) {
            const map: Record<number, string> = { 429: "AI-Buddy is busy. Try again in a minute.", 402: "The configured AI usage is finished for now.", 403: "AI access is blocked right now." };
            return Response.json({ error: map[response.status] ?? "Could not create the song. Please try again." }, { status: response.status });
          }
          const result = await response.json() as { choices?: { message?: { content?: string } }[] };
          lyrics = result.choices?.[0]?.message?.content?.trim() ?? "";
        }

        if (!lyrics) return Response.json({ error: "Could not create the lyrics. Please try again." }, { status: 502 });
        return Response.json({ lyrics, outputType: "lyrics-only" });
      },
    },
  },
});
