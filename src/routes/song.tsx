import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Loader2, Music, Download, Volume2, Square } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Toaster, toast } from "sonner";
import { useMediaLifecycle } from "@/hooks/use-media-lifecycle";

export const Route = createFileRoute("/song")({
  head: () => ({
    meta: [
      { title: "AI Song Creator — AI-Buddy" },
      { name: "description", content: "Write original songs in Urdu, Hindi, Punjabi or English with AI-Buddy." },
      { property: "og:title", content: "AI Song Creator — AI-Buddy" },
      { property: "og:description", content: "Write original songs in Urdu, Hindi, Punjabi or English with AI-Buddy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Song,
});

const LANGS = ["Urdu", "Hindi", "Punjabi", "English"];
const STYLES = ["Romantic", "Sad", "Emotional", "Rap", "Pop", "Modern", "Cinematic"];

function Chips({ items, value, set }: { items: string[]; value: string; set: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <button key={i} onClick={() => set(i)}
          className={`rounded-full px-4 py-2.5 text-base font-semibold ${value === i ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{i}</button>
      ))}
    </div>
  );
}

function Song() {
  const [idea, setIdea] = useState("");
  const [lang, setLang] = useState("Urdu");
  const [voice, setVoice] = useState("Female");
  const [style, setStyle] = useState("Romantic");
  const [lyrics, setLyrics] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  useMediaLifecycle(() => { window.speechSynthesis?.cancel(); setReading(false); });
  const code = ({ Urdu: "ur-PK", Hindi: "hi-IN", Punjabi: "pa-IN", English: "en-US" } as Record<string, string>)[lang] ?? "en-US";
  function readAloud() {
    const synth = window.speechSynthesis; if (!synth) { toast.error("Voice not supported here."); return; }
    synth.cancel();
    const base = code.split("-")[0] ?? "en";
    const vs = synth.getVoices().filter((v) => v.lang.replace("_", "-").startsWith(base));
    const male = /male|david|ravi|hemant|madhur|guy/i, fem = /female|zira|swara|heera|kalpana|aria|jenny/i;
    const v = voice === "Male" ? vs.find((x) => male.test(x.name.replace(/female/i, ""))) : vs.find((x) => fem.test(x.name));
    const lines = lyrics.replace(/\[.*?\]/g, "").split("\n").filter((l) => l.trim());
    const selectedVoice = v ?? vs[0];
    lines.forEach((l, i) => { const u = new SpeechSynthesisUtterance(l); u.lang = selectedVoice?.lang || code; if (selectedVoice) u.voice = selectedVoice; u.rate = 0.9; u.pitch = voice === "Male" ? 0.8 : 1.15;
      if (i === lines.length - 1) { u.onend = () => setReading(false); u.onerror = () => setReading(false); } synth.speak(u); });
    setReading(true);
  }
  function stopRead() { window.speechSynthesis?.cancel(); setReading(false); }
  function download() {
    const url = URL.createObjectURL(new Blob([lyrics], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "ai-buddy-song.txt"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async function make() {
    if (!idea.trim()) { toast.error("Please describe your song first."); return; }
    setBusy(true); setLyrics("");
    try {
      const r = await fetch("/api/song", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, lang, voice: voice.toLowerCase(), style: style.toLowerCase() }) });
      const j = await r.json();
      if (!r.ok) toast.error(j.error ?? "Something went wrong."); else setLyrics(j.lyrics);
    } catch { toast.error("No internet. Please try again."); }
    setBusy(false);
  }

  return (
    <main className="bg-glow min-h-dvh min-w-0 wrap-anywhere px-4 py-4 max-w-xl mx-auto space-y-5">
      <Toaster position="top-center" theme="dark" />
      <div className="flex items-center gap-3">
        <a href="/" aria-label="Back" className="rounded-xl p-2.5 hover:bg-secondary"><ArrowLeft className="size-6" /></a>
        <div className="song-orb size-10 rounded-full animate-breathe grid place-items-center"><Music className="size-5 text-primary-foreground" /></div>
        <h1 className="text-xl font-bold">AI Song Creator</h1>
      </div>
      <section className="space-y-2">
        <h2 className="font-semibold">1. What is your song about?</h2>
        <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={3} maxLength={1000}
          placeholder="e.g. A song for my mother / maa ke liye gaana"
          className="w-full rounded-2xl border border-input bg-card p-3 text-base" />
      </section>
      <section className="space-y-2"><h2 className="font-semibold">2. Language</h2><Chips items={LANGS} value={lang} set={setLang} /></section>
      <section className="space-y-2"><h2 className="font-semibold">3. Singer voice</h2><Chips items={["Female", "Male"]} value={voice} set={setVoice} /></section>
      <section className="space-y-2"><h2 className="font-semibold">4. Music style</h2><Chips items={STYLES} value={style} set={setStyle} /></section>
      <button onClick={make} disabled={busy}
        className="song-orb w-full rounded-2xl py-4 text-lg font-bold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-70">
        {busy ? <><Loader2 className="animate-spin" /> Writing your song…</> : <>🎵 Create my song</>}
      </button>
      {lyrics && (
        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <pre className="whitespace-pre-wrap font-sans text-base leading-loose">{lyrics}</pre>
          <button onClick={() => { navigator.clipboard.writeText(lyrics); toast.success("Lyrics copied!"); }}
            className="w-full rounded-xl bg-secondary py-3 font-semibold flex items-center justify-center gap-2"><Copy className="size-5" /> Copy lyrics</button>
          <button onClick={() => reading ? stopRead() : readAloud()} className="w-full rounded-xl bg-secondary py-3 font-semibold flex items-center justify-center gap-2">{reading ? <><Square className="size-5" /> Stop</> : <><Volume2 className="size-5" /> Read lyrics aloud ({voice} voice)</>}</button>
          <button onClick={download} className="w-full rounded-xl bg-secondary py-3 font-semibold flex items-center justify-center gap-2"><Download className="size-5" /> Download lyrics</button>
        </section>
      )}
      <VoiceRecorder />
      <p className="text-sm text-muted-foreground">Note: AI-Buddy writes original lyrics for free, and can read them aloud with the phone's free voice. Real AI singing with music and beats is not switched on yet, because it uses paid AI credit. Ask the app owner to enable it.</p>
    </main>
  );
}
