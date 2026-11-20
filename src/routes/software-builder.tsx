import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Bot, Code2, Copy, LoaderCircle, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/software-builder")({
  head: () => ({
    meta: [
      { title: "Mini Software Builder — AI Buddy" },
      { name: "description", content: "Turn a simple idea into a starter software plan and code with AI Buddy." },
    ],
  }),
  component: SoftwareBuilder,
});

const starterIdeas = [
  "A simple shop inventory and sales tracker",
  "A customer booking form for my business",
  "A personal income and expense tracker",
];

function SoftwareBuilder() {
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState("Mobile-friendly website");
  const [language, setLanguage] = useState("Simple English");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!idea.trim() || busy) return;
    setBusy(true);
    setResult("");
    const prompt = [
      "You are the Mini Software Builder inside AI Buddy. Help a beginner turn an idea into a safe, small first software prototype.",
      "User idea: " + idea.trim(),
      "Target: " + platform,
      "Explanation language: " + language,
      "Return these sections in order: (1) What this first version will do, (2) simple screen list, (3) data it needs, (4) complete starter code for a single-file HTML/CSS/JavaScript prototype when suitable, otherwise a clearly labelled small project scaffold, (5) how to test it on a phone, (6) what is not implemented yet.",
      "Keep scope small and avoid paid services, external API keys, login, payment collection, or storing sensitive data in this first prototype. Never claim the code is deployed or production-ready. If the idea is too large, suggest a safe first version.",
      "Write the explanation in " + language + ". Keep code in standard programming syntax."
    ].join("\n\n");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: prompt }],
          lang: "auto",
          memories: [],
          mode: "manager",
        }),
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(payload.error || "AI service is not available. Please check the AI setup.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const event = JSON.parse(raw) as { choices?: { delta?: { content?: string | Array<{ text?: string }> } }[] };
            const delta = event.choices?.[0]?.delta?.content;
            if (typeof delta === "string") answer += delta;
            else if (Array.isArray(delta)) answer += delta.map((part) => part.text ?? "").join("");
            if (answer) setResult(answer);
          } catch { /* Ignore incomplete stream frames. */ }
        }
      }
      if (!answer.trim()) throw new Error("The AI returned an empty result. Please try again.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate the starter.");
    } finally {
      setBusy(false);
    }
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Starter plan and code copied.");
    } catch {
      toast.error("Copy is not available in this browser. Select the text and copy it.");
    }
  }

  return (
    <main className="min-h-dvh bg-[#070914] px-3 py-5 text-slate-100 sm:px-6">
      <Toaster position="top-center" theme="dark" />
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm text-cyan-300"><ArrowLeft className="size-4" /> Back to AI Buddy</Link>
        <header className="mb-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 to-violet-500/10 p-5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-cyan-400/15"><Code2 className="size-6 text-cyan-200" /></div>
            <div><h1 className="text-xl font-black">Mini Software Builder</h1><p className="text-xs text-slate-400">Describe a small idea. Get a starter plan and code.</p></div>
            <Sparkles className="ml-auto size-5 text-cyan-300" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">اپنا خیال سادہ الفاظ میں لکھیں۔ AI آپ کے لیے ابتدائی خاکہ اور کوڈ بنانے میں مدد کرے گا۔</p>
        </header>

        <form onSubmit={generate} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <label className="block text-sm font-semibold" htmlFor="software-idea">What small software do you want?</label>
          <textarea id="software-idea" value={idea} onChange={(event) => setIdea(event.target.value)} rows={4} maxLength={3000} required placeholder="Example: I want a simple app to record shop sales, expenses and daily profit..." className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none" />
          <div className="flex flex-wrap gap-2">
            {starterIdeas.map((sample) => <button key={sample} type="button" onClick={() => setIdea(sample)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/10">{sample}</button>)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">Build type
              <select value={platform} onChange={(event) => setPlatform(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-3 text-sm">
                <option>Mobile-friendly website</option><option>Simple Android app plan</option><option>Browser-based tool</option>
              </select>
            </label>
            <label className="block text-sm">Explanation language
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-3 text-sm">
                <option>Simple English</option><option>Urdu</option><option>Hindi</option><option>Roman Urdu</option>
              </select>
            </label>
          </div>
          <button disabled={busy || !idea.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-bold text-white disabled:opacity-50">
            {busy ? <><LoaderCircle className="size-4 animate-spin" /> Building your starter…</> : <><Bot className="size-4" /> Create my software starter</>}
          </button>
        </form>

        {result && <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-bold">Your software starter</h2><button onClick={() => void copyResult()} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs"><Copy className="size-4" /> Copy</button></div>
          <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">{result}</pre>
        </section>}

        <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">This first version generates a plan and starter code only. It does not publish software, create APK files, connect databases, or guarantee production security. AI usage may have provider limits or costs; no paid generation is enabled by this tool.</p>
      </div>
    </main>
  );
}
