import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Mic, Send, Trash2, Volume2, Square, Music, Gamepad2, Sparkles, X, Code2, LayoutDashboard } from "lucide-react";
import { Toaster, toast } from "sonner";

type Message = { role: "user" | "assistant"; text: string; image?: string };
type Language = "auto" | "ur" | "hi" | "pa" | "en" | "roman-ur";
const STORAGE_KEY = "ai-buddy-chat-v1";
const MEMORY_KEY = "ai-buddy-memories-v1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-Buddy — Your Friendly AI Assistant" },
      { name: "description", content: "A friendly AI assistant for Urdu, Hindi, Punjabi and English." },
      { property: "og:title", content: "AI-Buddy" },
      { property: "og:description", content: "Your friendly multilingual AI companion." },
    ],
  }),
  component: Home,
});

function readStored<T,>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch { return fallback; }
}

function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<Language>("auto");
  const [mode, setMode] = useState<"chat" | "game">("chat");
  const [image, setImage] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  const [memories, setMemories] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(readStored<Message[]>(STORAGE_KEY, []));
    setMemories(readStored<string[]>(MEMORY_KEY, []));
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (storageReady) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
  }, [messages, storageReady]);
  useEffect(() => {
    if (storageReady) localStorage.setItem(MEMORY_KEY, JSON.stringify(memories.slice(0, 20)));
  }, [memories, storageReady]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  useEffect(() => () => {
    abortRef.current?.abort();
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  async function send() {
    const prompt = text.trim();
    if ((!prompt && !image) || busy) return;
    const outgoing: Message = { role: "user", text: prompt, ...(image ? { image } : {}) };
    const next = [...messages, outgoing];
    setMessages([...next, { role: "assistant", text: "" }]);
    setText(""); setImage(undefined); setBusy(true);
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-16), lang: language, memories, mode: mode === "game" ? "game" : undefined }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || "AI-Buddy could not answer. Please try again.");
      }
      if (!response.body) throw new Error("No response received.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; let answer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const event = JSON.parse(raw) as { choices?: { delta?: { content?: string | Array<{ type?: string; text?: string }> }[] }[] };
            const delta = event.choices?.[0]?.delta?.content;
            if (typeof delta === "string") answer += delta;
            else if (Array.isArray(delta)) answer += delta.map((part) => part.text ?? "").join("");
            if (answer) setMessages([...next, { role: "assistant", text: answer }]);
          } catch { /* Ignore incomplete/non-JSON stream frames. */ }
        }
      }
      if (!answer.trim()) throw new Error("AI-Buddy returned an empty answer. Please try again.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessages(next);
      toast.error(error instanceof Error ? error.message : "Connection problem. Please try again.");
    } finally { setBusy(false); abortRef.current = null; }
  }

  function addImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image."); return; }
    if (file.size > 4 * 1024 * 1024) { toast.error("Image must be smaller than 4 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.onerror = () => toast.error("Could not open this image.");
    reader.readAsDataURL(file);
  }

  function clearChat() {
    if (!window.confirm("Clear this conversation and saved memories on this phone?")) return;
    setMessages([]); setMemories([]);
    localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(MEMORY_KEY);
    window.speechSynthesis?.cancel(); toast.success("Chat and saved memories cleared on this phone.");
  }

  function speak(message: string) {
    if (!("speechSynthesis" in window)) { toast.error("Voice playback is not supported in this browser."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = language === "ur" ? "ur-PK" : language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : language === "en" ? "en-US" : "ur-PK";
    utterance.rate = 0.92;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance); setSpeaking(true);
  }

  function startVoice() {
    const SpeechRecognition = (window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Voice typing is not supported here. Please type your message."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ur" ? "ur-PK" : language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : language === "en" ? "en-US" : "ur-PK";
    recognition.interimResults = false;
    recognition.onresult = (event) => setText((old) => old + event.results[0][0].transcript);
    recognition.onerror = () => { setListening(false); toast.error("Voice typing stopped. You can type instead."); };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition; setListening(true); recognition.start();
  }

  return (
    <main className="bg-glow min-h-dvh flex flex-col">
      <Toaster position="top-center" theme="dark" />
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="orb lotus grid size-11 shrink-0 place-items-center rounded-full"><Sparkles className="size-6 text-primary-foreground" /></div>
          <div className="min-w-0 flex-1"><h1 className="font-bold tracking-tight">AI-Buddy</h1><p className="text-xs text-muted-foreground">Your friendly AI companion</p></div>
          <Link to="/dashboard" className="rounded-xl bg-secondary p-2.5" aria-label="Open all AI Buddy tools"><LayoutDashboard className="size-5" /></Link>
          <Link to="/studio" className="rounded-xl bg-secondary p-2.5" aria-label="Marketing and music studio"><Sparkles className="size-5" /></Link>
          <Link to="/software-builder" className="rounded-xl bg-secondary p-2.5" aria-label="Mini software builder"><Code2 className="size-5" /></Link>
          <Link to="/song" className="rounded-xl bg-secondary p-2.5" aria-label="Song creator"><Music className="size-5" /></Link>
          <button onClick={clearChat} className="rounded-xl bg-secondary p-2.5" aria-label="Clear chat and memories"><Trash2 className="size-5" /></button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div className="flex gap-2">
            <button onClick={() => setMode("chat")} className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === "chat" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>✨ AI Assistant</button>
            <button onClick={() => setMode("game")} className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold ${mode === "game" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}><Gamepad2 className="size-4" /> Gaming Help</button>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="max-w-36 rounded-xl border border-input bg-card px-3 py-2 text-sm" aria-label="Reply language">
            <option value="auto">Auto language</option><option value="ur">اردو</option><option value="hi">हिन्दी</option><option value="pa">Punjabi</option><option value="roman-ur">Roman Urdu</option><option value="en">English</option>
          </select>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
            <div className="orb lotus mb-5 grid size-24 place-items-center rounded-full animate-breathe"><Sparkles className="size-12 text-primary-foreground" /></div>
            <h2 className="text-2xl font-bold">Assalam-o-Alaikum! 👋</h2>
            <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">I am AI-Buddy. Ask me anything in Urdu, Hindi, Punjabi or English. You can also send a screenshot.</p>
            <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-2 text-left">
              {["Explain this phone setting", "Help me write a message", "Tell me about this photo", "Help with a mobile game"].map((tip) => <button key={tip} onClick={() => setText(tip)} className="rounded-2xl border border-border bg-card/80 p-3 text-sm hover:bg-secondary">{tip}</button>)}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 py-3">
            {messages.map((message, index) => <article key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
                {message.image && <img src={message.image} alt="Uploaded screenshot" className="mb-2 max-h-64 rounded-xl object-contain" />}
                {message.text && <p className="whitespace-pre-wrap break-words text-[15px] leading-7">{message.text}</p>}
                {message.role === "assistant" && message.text && <button onClick={() => speak(message.text)} className="mt-2 inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs"><Volume2 className="size-4" /> Listen</button>}
              </div>
            </article>)}
            {busy && messages[messages.length - 1]?.text === "" && <div className="text-sm text-muted-foreground">AI-Buddy is thinking…</div>}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="sticky bottom-0 mt-3 rounded-3xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur">
          {image && <div className="mb-2 flex items-center gap-2"><img src={image} alt="Selected image" className="size-14 rounded-xl object-cover" /><span className="flex-1 text-xs text-muted-foreground">Image ready to send</span><button onClick={() => setImage(undefined)} aria-label="Remove image"><X className="size-5" /></button></div>}
          <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} rows={2} maxLength={4000} placeholder={mode === "game" ? "Ask about your game…" : "Message AI-Buddy…"} className="max-h-36 min-h-12 w-full resize-y bg-transparent px-2 py-2 text-base outline-none placeholder:text-muted-foreground" />
          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex gap-1">
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => addImage(e.target.files?.[0])} />
              <button onClick={() => fileRef.current?.click()} className="rounded-xl bg-secondary p-2.5" aria-label="Add screenshot or photo"><ImagePlus className="size-5" /></button>
              <button onClick={listening ? () => recognitionRef.current?.stop() : startVoice} className={`rounded-xl p-2.5 ${listening ? "bg-destructive text-white" : "bg-secondary"}`} aria-label="Voice typing">{listening ? <Square className="size-5" /> : <Mic className="size-5" />}</button>
            </div>
            <button onClick={() => void send()} disabled={busy || (!text.trim() && !image)} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-50"><Send className="size-4" /> Send</button>
          </div>
        </div>
        <p className="pt-2 text-center text-[11px] text-muted-foreground">Chat and saved memories are stored on this phone. Do not share passwords or OTP codes.</p>
      </section>
    </main>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
