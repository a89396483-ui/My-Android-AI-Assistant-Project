import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity, ArrowLeft, ArrowUpRight, Bot, BriefcaseBusiness, ChartNoAxesCombined,
  CheckCircle2, ChevronRight, CircleHelp, ClipboardList, Contact, FileText,
  Headphones, LayoutDashboard, Megaphone, MessageCircle, Package, Search,
  Settings2, ShieldCheck, ShoppingBag, Sparkles, Users, Wallet, WandSparkles,
} from "lucide-react";

export const Route = createFileRoute("/business-manager")({
  head: () => ({
    meta: [
      { title: "AI Business Manager — AI-Buddy" },
      { name: "description", content: "Your AI business team, managed from one simple dashboard." },
    ],
  }),
  component: BusinessManager,
});

const modules = [
  { id: "manager", title: "Main AI Manager", subtitle: "Talk to your business manager", icon: Bot, color: "from-violet-500 to-fuchsia-500", status: "Ready to configure" },
  { id: "marketing", title: "Marketing Agent", subtitle: "Posts, offers and campaigns", icon: Megaphone, color: "from-fuchsia-500 to-pink-500", status: "Draft workflow first" },
  { id: "leads", title: "Customer Finder", subtitle: "Research and organize prospects", icon: Search, color: "from-cyan-500 to-blue-500", status: "Connection needed" },
  { id: "replies", title: "Customer Conversations", subtitle: "FAQs, enquiries and replies", icon: MessageCircle, color: "from-emerald-500 to-teal-500", status: "Setup needed" },
  { id: "handoff", title: "Owner Handoff", subtitle: "Send serious enquiries to you", icon: Contact, color: "from-amber-500 to-orange-500", status: "Owner number needed" },
  { id: "accounts", title: "Accounts & Reports", subtitle: "Income, expenses and profit", icon: Wallet, color: "from-indigo-500 to-violet-500", status: "No records yet" },
  { id: "business", title: "Business Workspace", subtitle: "Services, prices and business details", icon: BriefcaseBusiness, color: "from-sky-500 to-cyan-500", status: "Profile needed" },
  { id: "teacher", title: "Business Teacher", subtitle: "Learn and grow your business", icon: Sparkles, color: "from-rose-500 to-red-500", status: "Ready to configure" },
  { id: "orders", title: "Leads & Orders", subtitle: "Keep every enquiry in one place", icon: ClipboardList, color: "from-lime-500 to-green-500", status: "No records yet" },
  { id: "settings", title: "Settings & Permissions", subtitle: "Privacy, budget and connected apps", icon: Settings2, color: "from-slate-500 to-slate-400", status: "Owner setup" },
] as const;

const nav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "leads", label: "Customers", icon: Users },
  { id: "replies", label: "Messages", icon: MessageCircle },
  { id: "accounts", label: "Accounts", icon: ChartNoAxesCombined },
  { id: "settings", label: "Settings", icon: Settings2 },
] as const;

function BusinessManager() {
  const [active, setActive] = useState("overview");
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState("");
  const [showAll, setShowAll] = useState(false);
  const selected = useMemo(() => modules.find((m) => m.id === active), [active]);

  function askManager(value = question) {
    const clean = value.trim();
    if (!clean) return;
    setSent(clean);
    setQuestion("");
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#070914] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(124,58,237,.22),transparent_34%),radial-gradient(ellipse_at_100%_45%,rgba(6,182,212,.10),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-dvh max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-slate-950/60 p-5 lg:flex lg:flex-col">
          <div className="mb-9 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20"><WandSparkles className="size-5" /></div>
            <div><p className="text-sm font-black tracking-[.16em]">AI-BUDDY</p><p className="text-[10px] tracking-[.2em] text-cyan-300">BUSINESS SUITE</p></div>
          </div>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Workspace</p>
          <nav className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} onClick={() => setActive(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active === item.id ? "bg-violet-500/20 text-white ring-1 ring-violet-400/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="size-4" />{item.label}</button>;
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <ShieldCheck className="mb-2 size-5 text-cyan-300" />
            <p className="text-xs font-semibold">Owner-controlled AI</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">External messages and paid campaigns stay approval-only until you enable them.</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-3 sm:p-5 lg:p-7">
          <header className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link to="/" aria-label="Back to AI Buddy" className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"><ArrowLeft className="size-4" /></Link>
              <div className="min-w-0"><p className="truncate text-xs text-slate-400">AI-Buddy / Workspace</p><h1 className="truncate text-lg font-bold sm:text-2xl">Business Manager</h1></div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-semibold text-emerald-300"><span className="size-2 rounded-full bg-emerald-400" /> Setup mode</div>
          </header>

          <nav className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-2 sm:grid-cols-6 lg:hidden">
            {nav.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setActive(item.id)} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] ${active === item.id ? "bg-violet-500/20 text-white" : "text-slate-400"}`}><Icon className="size-4" /><span className="truncate">{item.label}</span></button>; })}
          </nav>

          <div className="mb-5 overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-r from-violet-950/90 via-slate-900 to-cyan-950/70 p-4 shadow-[0_20px_70px_rgba(76,29,149,.18)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-200"><Sparkles className="size-3" /> Your AI team</div>
                <h2 className="text-xl font-bold leading-tight sm:text-2xl">One manager. A whole team of specialists.</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">Tell your main AI what you need. It will route the task to the right specialist and bring the result back here.</p>
              </div>
              <div className="grid size-20 shrink-0 place-items-center self-center rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-violet-500/30 to-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,.15)] sm:size-24"><Bot className="size-11 text-cyan-100" /></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Plan my marketing", "Find customers", "Show my business options"].map((v) => <button key={v} onClick={() => askManager(v)} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-medium text-slate-200 hover:bg-white/10">{v}</button>)}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); askManager(); }} className="mt-3 flex gap-2 rounded-2xl border border-white/15 bg-black/20 p-2">
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask your AI manager…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-500" />
              <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white">Ask</button>
            </form>
            {sent && <p className="mt-2 text-xs text-cyan-200">Request noted in this preview: “{sent}”. AI connection will be added in the next integration phase.</p>}
          </div>

          {active === "overview" ? (
            <>
              <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[
                  { label: "New customers", value: "—", note: "Connect customer sources", icon: Users },
                  { label: "Open enquiries", value: "—", note: "No live inbox connected", icon: MessageCircle },
                  { label: "Orders", value: "—", note: "No orders recorded", icon: ShoppingBag },
                  { label: "Profit", value: "—", note: "Add account records", icon: Wallet },
                ].map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/65 p-4"><div className="mb-3 flex items-center justify-between text-slate-400"><span className="text-[11px]">{item.label}</span><Icon className="size-4 text-cyan-300" /></div><p className="text-2xl font-bold">{item.value}</p><p className="mt-1 text-[10px] text-slate-500">{item.note}</p></div>; })}
              </div>
              <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-base font-bold">Your AI departments</h2><p className="mt-1 text-[11px] text-slate-400">Choose a specialist to see its workspace.</p></div><button onClick={() => setShowAll(!showAll)} className="shrink-0 text-xs font-semibold text-cyan-300">{showAll ? "Show less" : "View all"} <ArrowUpRight className="inline size-3" /></button></div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {modules.slice(0, showAll ? modules.length : 6).map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setActive(item.id)} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/65 p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-slate-900">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}><Icon className="size-5 text-white" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{item.title}</span><span className="mt-1 block truncate text-[10px] text-slate-400">{item.subtitle}</span><span className="mt-2 inline-flex items-center gap-1 text-[9px] text-cyan-300"><Activity className="size-3" />{item.status}</span></span>
                  <ChevronRight className="size-4 shrink-0 text-slate-500 group-hover:text-white" />
                </button>; })}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-4"><div className="mb-2 flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-300" /><h3 className="text-sm font-semibold">Safe by default</h3></div><p className="text-xs leading-relaxed text-slate-400">The AI can prepare drafts. You approve before it sends messages, publishes posts, or spends money.</p></div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-4"><div className="mb-2 flex items-center gap-2"><CircleHelp className="size-4 text-cyan-300" /><h3 className="text-sm font-semibold">First setup step</h3></div><p className="text-xs leading-relaxed text-slate-400">Add your business name, services, prices and public contact details before enabling customer-facing replies.</p></div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-7">
              {selected ? <><div className="mb-4 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500"><selected.icon className="size-6" /></span><div><h2 className="text-lg font-bold">{selected.title}</h2><p className="text-xs text-slate-400">{selected.subtitle}</p></div></div><div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4"><p className="text-sm font-semibold text-amber-200">Setup required</p><p className="mt-1 text-xs leading-relaxed text-slate-300">This workspace is part of the first dashboard build. Its live AI tools and external integrations are not connected yet. We will configure it without changing your existing AI Buddy features.</p></div><button onClick={() => setActive("overview")} className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-xs font-semibold hover:bg-white/15">Back to overview</button></> : <p className="text-sm text-slate-300">This section is being prepared.</p>}
            </div>
          )}

          <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-[10px] text-slate-500"><span>AI-Buddy Business Suite · Preview build</span><span className="inline-flex items-center gap-1"><ShieldCheck className="size-3" /> Owner approval required for live actions</span></footer>
        </section>
      </div>
    </main>
  );
}
