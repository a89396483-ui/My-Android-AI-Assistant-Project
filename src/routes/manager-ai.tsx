import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Bot, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/manager-ai")({
  head: () => ({ meta: [{ title: "AI Business Manager — AI-Buddy" }] }),
  component: ManagerAI,
});

type Message = { role: "user" | "assistant"; text: string };

async function readEventStream(response: Response, onText: (text: string) => void) {
  if (!response.body) throw new Error("AI response stream is unavailable.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n");
    buffer = events.pop() ?? "";
    for (const line of events) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const payload = JSON.parse(data);
        const piece = payload.choices?.[0]?.delta?.content;
        if (typeof piece === "string") onText(piece);
      } catch { /* Ignore incomplete or non-JSON SSE lines. */ }
    }
  }
}

function ManagerAI() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "السلام علیکم! میں آپ کا AI Business Manager ہوں۔ کاروبار، مارکیٹنگ، گانے کی پروموشن، گاہکوں کے جواب یا روزانہ کے کام کے بارے میں بتائیں۔ میں عملی منصوبہ اور تیار مواد دوں گا۔ میں آپ کی اجازت کے بغیر کوئی پوسٹ یا پیغام خود نہیں بھیجوں گا۔" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, text }, { role: "assistant" as const, text: "" }];
    setMessages(next); setInput(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: "auto", mode: "manager", messages: next.filter((m) => m.text).map(({ role, text: content }) => ({ role, text: content })) }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "AI Manager is unavailable. Check the AI service setup.");
      }
      await readEventStream(response, (piece) => setMessages((current) => current.map((m, i) => i === current.length - 1 ? { ...m, text: m.text + piece } : m)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((current) => current.slice(0, -1));
    } finally { setBusy(false); }
  }

  return <main className="min-h-dvh bg-[#070914] px-3 py-5 text-slate-100 sm:px-6">
    <div className="mx-auto max-w-3xl">
      <a href="/business-manager" className="mb-5 inline-flex items-center gap-2 text-sm text-cyan-300"><ArrowLeft className="size-4" /> Business Manager</a>
      <header className="mb-5 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-5">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-violet-500/20"><Bot className="size-6" /></div><div><h1 className="text-xl font-black">Main AI Business Manager</h1><p className="text-xs text-slate-400">Real AI chat · Gemini through the secure server API</p></div><Sparkles className="ml-auto size-5 text-cyan-300" /></div>
        <p className="mt-3 text-xs leading-relaxed text-slate-300">مارکیٹنگ، گاہک، بزنس پلان، سوشل میڈیا پوسٹس اور میوزک پروموشن میں مدد۔ پوسٹ یا پیغام بھیجنے سے پہلے آپ کی منظوری ضروری ہے۔</p>
      </header>
      <section className="mb-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        {messages.map((m, i) => <div key={i} className={m.role === "user" ? "ml-8 rounded-2xl bg-violet-500/20 p-3 text-sm" : "mr-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-3 text-sm leading-relaxed"}><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{m.role === "user" ? "You" : "AI Manager"}</p><p className="whitespace-pre-wrap">{m.text || (busy && i === messages.length - 1 ? "سوچ رہا ہوں..." : "")}</p></div>)}
        {error && <p role="alert" className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
      </section>
      <form onSubmit={send} className="flex gap-2"><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="اپنا کاروباری کام یہاں لکھیں..." rows={2} className="min-w-0 flex-1 resize-y rounded-xl border border-white/10 bg-slate-900 p-3 text-sm outline-none focus:border-cyan-400" /><button disabled={busy || !input.trim()} className="grid size-12 shrink-0 place-items-center self-end rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 disabled:opacity-40" aria-label="Send message"><Send className="size-5" /></button></form>
      <p className="mt-3 text-center text-[10px] text-slate-500">AI جواب غلط بھی ہو سکتا ہے؛ اہم کاروباری فیصلے چیک کریں۔ API key server پر محفوظ رہتی ہے۔</p>
    </div>
  </main>;
}
