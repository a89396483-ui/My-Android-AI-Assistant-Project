import { createFileRoute } from "@tanstack/react-router";
import { songInput } from "@/lib/ai-input";

const MODEL = "google/gemini-3.8-flash";
const hits = new Map<string, number[]>();

export const Route = createFileRoute("/api/song")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("cf-connecting-ip") || "anon";
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

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI is not configured." }, { status: 500 });

        let r: Response;
        try {
          r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
            body: JSON.stringify({
              model: MODEL,
              messages: [
                { role: "system", content: "You are a gifted songwriter. Write fully original song lyrics (never copy existing songs). Output only: a title line, then labelled sections [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Chorus]. No markdown symbols." },
                { role: "user", content: `Language: ${lang} (use its native script; for Punjabi use Shahmukhi or Gurmukhi as fits). Style: ${style}. Singer: ${voice} voice. Song idea: ${idea}` },
              ],
            }),
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
          });
        } catch {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return Response.json({ error: "AI-Buddy could not connect to the AI service. Please try again." }, { status: 502 });
        }
        if (!r.ok) {
          const map: Record<number, string> = { 429: "AI-Buddy is busy. Try again in a minute.", 402: "The free AI usage is finished for now.", 403: "AI access is blocked right now." };
          return Response.json({ error: map[r.status] ?? "Could not create the song. Please try again." }, { status: r.status });
        }
        const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const lyrics = j.choices?.[0]?.message?.content?.trim();
        if (!lyrics) return Response.json({ error: "Could not create the song. Please try again." }, { status: 502 });
        return Response.json({ lyrics });
      },
    },
  },
});
