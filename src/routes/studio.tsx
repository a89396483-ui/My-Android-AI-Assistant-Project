import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Megaphone, Music2, Clapperboard, Copy, ShieldCheck, CalendarDays, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";
import { buildSocialChannelPosts, buildViralCampaign } from "@/lib/business-manager";
import { buildMusicVideoStoryboard, buildProviderPrompt } from "@/lib/music-video-prompts";
import type { MusicVideoBrief } from "@/lib/music-video-studio";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Marketing & Music Studio — AI Buddy" },
      { name: "description", content: "Plan AI Buddy marketing, music promotion and music-video storyboards." },
    ],
  }),
  component: Studio,
});

type Tab = "growth" | "music" | "video";
const field = "w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none";
const button = "rounded-xl px-4 py-3 text-sm font-semibold transition";
const panel = "rounded-2xl border border-white/10 bg-white/[0.04] p-4";

function Studio() {
  const [tab, setTab] = useState<Tab>("growth");
  const [business, setBusiness] = useState("AI Buddy");
  const [service, setService] = useState("Urdu, Hindi and Punjabi AI help, voice chat and business tools");
  const [area, setArea] = useState("Pakistan");
  const [contact, setContact] = useState("");
  const [offer, setOffer] = useState("Try AI Buddy and explore the free features");
  const [language, setLanguage] = useState("Roman Urdu");
  const [musicName, setMusicName] = useState("");
  const [artist, setArtist] = useState("");
  const [musicAudience, setMusicAudience] = useState("Urdu and Punjabi music listeners");
  const [musicDetails, setMusicDetails] = useState("Share the strongest emotional moment from the song");
  const [rights, setRights] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [duration, setDuration] = useState(25);
  const [format, setFormat] = useState<MusicVideoBrief["format"]>("9:16");
  const [output, setOutput] = useState("");

  const businessPosts = useMemo(() => buildSocialChannelPosts({
    businessName: business, services: service, area, publicContact: contact,
    offer, language,
  }), [business, service, area, contact, offer, language]);

  function makeGrowth() {
    const text = businessPosts.map((post) => "## " + post.label + "\n" + post.text).join("\n\n---\n\n");
    setOutput(text);
    toast.success("Platform-wise marketing drafts are ready.");
  }

  function makeMusic() {
    const campaign = buildViralCampaign({
      type: "music", name: musicName || "New song", audience: musicAudience,
      platform: "Instagram Reels, TikTok and YouTube Shorts", language,
      goal: "Reach listeners and invite genuine engagement", details: musicDetails,
      callToAction: "Listen to the preview and share your favourite line",
      rightsConfirmed: rights,
    });
    setOutput([
      "MUSIC PROMOTION PLAN — " + campaign.title,
      "Artist: " + (artist || "Add artist name"),
      "Audience: " + campaign.audience,
      "",
      "HOOKS", ...campaign.hooks.map((x, i) => (i + 1) + ". " + x),
      "",
      "25-SECOND VIDEO SCRIPT", campaign.script,
      "",
      "CAPTION", campaign.caption,
      "",
      "A/B/C CREATIVE TESTS", ...campaign.experiments,
      "",
      "RIGHTS CHECK", campaign.rightsNote,
      "",
      "PUBLISHING", campaign.publishNote,
    ].join("\n"));
    toast.success("Music promotion plan is ready.");
  }

  function makeVideoPlan() {
    const brief: MusicVideoBrief = {
      projectId: "local-preview", songAssetId: "owner-upload-required",
      prompt: videoPrompt || "Create an emotional cinematic music video for this song",
      language: language === "Urdu" ? "ur" : language === "Hindi" ? "hi" : language === "Punjabi" ? "pa" : "auto",
      format, durationSeconds: duration, resolution: "draft",
      includeLyrics: true, includeLipSync: false, fictionalPerformersOnly: true,
    };
    const board = buildMusicVideoStoryboard(brief);
    setOutput([
      "MUSIC VIDEO STORYBOARD — " + board.title,
      "Format: " + board.format + " | Duration: " + board.durationSeconds + " seconds",
      "",
      ...board.scenes.map((scene) => scene.startSecond + "–" + scene.endSecond + " sec · " + scene.purpose.toUpperCase() + "\n" + scene.visualDirection + (scene.onScreenText ? "\nText: " + scene.onScreenText : "")),
      "",
      "VIDEO GENERATION PROMPT", buildProviderPrompt(brief, board),
      "",
      "SAFETY & RIGHTS", ...board.safetyNotes.map((note) => "• " + note),
      "",
      "STATUS: This is a storyboard and prompt only. A video-generation provider is not connected yet, so no finished video file is produced here.",
    ].join("\n\n"));
    toast.success("Storyboard and video prompt are ready.");
  }

  async function generateWithAI(prompt: string) {
    setOutput("AI is preparing your draft…");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: language === "Urdu" ? "ur" : language === "Hindi" ? "hi" : language === "Punjabi" ? "pa" : "roman-ur", mode: "manager", messages: [{ role: "user", text: prompt }] }),
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(payload.error || "AI service is not configured yet.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const event = JSON.parse(raw) as { choices?: Array<{ delta?: { content?: string } }> };
            answer += event.choices?.[0]?.delta?.content ?? "";
          } catch { /* Ignore incomplete stream frames. */ }
        }
      }
      setOutput(answer.trim() || "AI returned an empty draft. Please try again.");
      toast.success("AI marketing draft is ready.");
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "AI connection failed.");
      toast.error("Could not generate with AI.");
    }
  }

  async function copyOutput() {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); toast.success("Copied."); }
    catch { toast.error("Copy is not available in this browser."); }
  }

  const tabs = [
    { id: "growth" as const, label: "AI Buddy Marketing", icon: Megaphone },
    { id: "music" as const, label: "Music Promotion", icon: Music2 },
    { id: "video" as const, label: "Song Video Studio", icon: Clapperboard },
  ];

  return (
    <main className="min-h-dvh bg-[#070914] text-slate-100">
      <Toaster position="top-center" theme="dark" />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070914]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <Link to="/" className="rounded-xl bg-white/10 p-2" aria-label="Back to AI Buddy"><ArrowLeft className="size-5" /></Link>
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400"><Sparkles className="size-5" /></div>
          <div><h1 className="font-bold">AI Buddy Creative Studio</h1><p className="text-xs text-slate-400">Business growth · Music promotion · Video planning</p></div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/70 via-slate-900 to-cyan-950/60 p-5 sm:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">One workspace · Three creative tools</p>
          <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Turn your business and music ideas into ready-to-review campaigns.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Prepare posts for different platforms, plan song launches and build a scene-by-scene music video concept. Review every draft before sharing.</p>
        </section>
        <nav className="grid gap-2 sm:grid-cols-3" aria-label="Creative tools">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTab(id); setOutput(""); }} className={button + " flex items-center justify-center gap-2 " + (tab === id ? "bg-violet-600 text-white" : "border border-white/10 bg-white/[0.04] text-slate-300")}>
              <Icon className="size-4" />{label}
            </button>
          ))}
        </nav>

        {tab === "growth" && <section className={panel + " space-y-4"}>
          <div><h3 className="text-xl font-bold">AI Buddy Growth Studio</h3><p className="mt-1 text-sm text-slate-400">Create separate drafts for Facebook, Instagram, TikTok, YouTube, X and WhatsApp.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">Brand name<input className={field} value={business} onChange={(e) => setBusiness(e.target.value)} /></label>
            <label className="space-y-1 text-sm">Area / country<input className={field} value={area} onChange={(e) => setArea(e.target.value)} /></label>
            <label className="space-y-1 text-sm sm:col-span-2">What does AI Buddy help with?<textarea className={field} rows={2} value={service} onChange={(e) => setService(e.target.value)} /></label>
            <label className="space-y-1 text-sm">Public contact / page link<input className={field} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Add only a public contact" /></label>
            <label className="space-y-1 text-sm">Offer / free trial message<input className={field} value={offer} onChange={(e) => setOffer(e.target.value)} /></label>
            <label className="space-y-1 text-sm">Language<select className={field} value={language} onChange={(e) => setLanguage(e.target.value)}><option>Roman Urdu</option><option>Urdu</option><option>Hindi</option><option>English</option><option>Punjabi</option></select></label>
          </div>
          <button onClick={makeGrowth} className={button + " w-full bg-violet-600 text-white"}>Create platform-wise marketing drafts</button>
          <button onClick={() => void generateWithAI(`Create a complete business marketing package for ${business}. Services: ${service}. Target area: ${area}. Public contact: ${contact || "not provided"}. Offer: ${offer}. Language: ${language}. Include Facebook and Instagram posts, WhatsApp status, 3 ad versions, 5 short-video hooks, a 7-day content calendar, a simple customer offer and measurable next steps. Never invent reviews or guarantee sales.`)} className={button + " w-full border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"}>Ask AI to create a detailed marketing package</button>
        </section>}

        {tab === "music" && <section className={panel + " space-y-4"}>
          <div><h3 className="text-xl font-bold">Music Promotion Studio</h3><p className="mt-1 text-sm text-slate-400">Prepare a release campaign, short-video hooks, captions and creative tests for an artist or song.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">Song title<input className={field} value={musicName} onChange={(e) => setMusicName(e.target.value)} placeholder="Your song name" /></label>
            <label className="space-y-1 text-sm">Artist name<input className={field} value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Singer / artist" /></label>
            <label className="space-y-1 text-sm sm:col-span-2">Who should hear this song?<input className={field} value={musicAudience} onChange={(e) => setMusicAudience(e.target.value)} /></label>
            <label className="space-y-1 text-sm sm:col-span-2">Song story / strongest moment<textarea className={field} rows={3} value={musicDetails} onChange={(e) => setMusicDetails(e.target.value)} /></label>
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm"><input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} className="mt-1 size-4" /><span>I own or have permission to use the recording, composition, vocals, lyrics, artwork and samples.</span></label>
          <button onClick={makeMusic} className={button + " w-full bg-violet-600 text-white"}>Create music promotion campaign</button>
          <button onClick={() => void generateWithAI(`Create a complete, practical music marketing package. Song: ${musicName || "Not provided"}. Artist: ${artist || "Not provided"}. Audience: ${musicAudience}. Song mood/story: ${musicDetails}. Language: ${language}. Include 5 original hooks, 3 short video scripts, platform captions, a 7-day posting calendar, low-budget Pakistan-friendly promotion ideas, and clear next steps. Do not promise guaranteed views. Mention that publishing is manual.`)} className={button + " w-full border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"}>Ask AI to create a detailed music campaign</button>
        </section>}

        {tab === "video" && <section className={panel + " space-y-4"}>
          <div><h3 className="text-xl font-bold">Song Video Studio</h3><p className="mt-1 text-sm text-slate-400">Build a short-video storyboard and a detailed prompt for a video-generation service.</p></div>
          <label className="block space-y-1 text-sm">Describe the song, mood and visuals<textarea className={field} rows={4} value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} placeholder="A romantic Punjabi song, rainy night, cinematic lights..." /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">Video format<select className={field} value={format} onChange={(e) => setFormat(e.target.value as MusicVideoBrief["format"])}><option value="9:16">Vertical 9:16 (Reels / Shorts)</option><option value="1:1">Square 1:1</option><option value="16:9">Wide 16:9</option></select></label>
            <label className="space-y-1 text-sm">Duration<select className={field} value={duration} onChange={(e) => setDuration(Number(e.target.value))}><option value={15}>15 seconds</option><option value={25}>25 seconds</option><option value={30}>30 seconds</option><option value={45}>45 seconds</option><option value={60}>60 seconds</option></select></label>
          </div>
          <button onClick={makeVideoPlan} className={button + " w-full bg-violet-600 text-white"}>Create storyboard and video prompt</button>
          <button onClick={() => void generateWithAI(`Create a detailed ${duration}-second ${format} music-video storyboard. Song idea: ${videoPrompt || musicDetails}. Language: ${language}. Give timed scenes, camera direction, visual mood, on-screen text, and a ready-to-copy video-generation prompt. Use fictional performers only and do not imitate a real artist.`)} className={button + " w-full border border-cyan-300/30 bg-cyan-400/10 text-cyan-100"}>Ask AI to expand this video plan</button>
          <p className="flex items-center gap-2 text-xs text-amber-300"><Clapperboard className="size-4 shrink-0" /> Finished video generation is not connected yet. This tool currently prepares the storyboard and prompt.</p>
        </section>}

        {output && <section className={panel + " space-y-3"}>
          <div className="flex items-center justify-between gap-3"><h3 className="font-bold">Your draft</h3><button onClick={copyOutput} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm"><Copy className="size-4" /> Copy</button></div>
          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-black/30 p-4 text-sm leading-6 text-slate-200">{output}</pre>
          <p className="flex items-start gap-2 text-xs text-emerald-300"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> Draft saved only in this screen. Check details and rights before publishing.</p>
        </section>}

        <section className="grid gap-3 sm:grid-cols-2">
          <div className={panel}><CalendarDays className="mb-2 size-5 text-cyan-300" /><h3 className="font-semibold">Campaign planning</h3><p className="mt-1 text-sm text-slate-400">Prepare weekly content ideas and test different hooks. Measure real results to improve the next campaign.</p></div>
          <div className={panel}><ShieldCheck className="mb-2 size-5 text-emerald-300" /><h3 className="font-semibold">Owner control</h3><p className="mt-1 text-sm text-slate-400">No automatic posting or paid generation is enabled. Account connections, costs and final approval must be added before external actions.</p></div>
        </section>
      </div>
    </main>
  );
}
