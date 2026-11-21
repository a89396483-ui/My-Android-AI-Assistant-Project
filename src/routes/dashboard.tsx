import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bot, BriefcaseBusiness, Code2, LayoutDashboard, Music, Sparkles, Users, WandSparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "AI Buddy — Dashboard" },
      { name: "description", content: "Open AI Buddy tools from one simple dashboard." },
    ],
  }),
  component: Dashboard,
});

const mainServices = [
  {
    title: "AI Buddy Conversation",
    description: "A friendly multilingual assistant for natural, respectful conversations in Urdu, Hindi, Punjabi and English.",
    to: "/" as const,
    icon: Bot,
    status: "Conversation assistant",
  },
  {
    title: "Customer Finder AI",
    description: "Organise potential customers, prepare personalised outreach messages and track follow-ups. Sending remains under your approval.",
    to: "/business-manager" as const,
    icon: Users,
    status: "Find and follow up",
  },
  {
    title: "Music Marketing AI",
    description: "Plan song launches, create captions and short-video campaign drafts, and prepare posts for connected social accounts.",
    to: "/studio" as const,
    icon: Music,
    status: "Music promotion",
  },
  {
    title: "Business Marketing AI",
    description: "Create business promotions, platform-specific posts, offers and campaign ideas to reach more customers.",
    to: "/studio" as const,
    icon: BriefcaseBusiness,
    status: "Business growth",
  },
];

const tools = [
  {
    title: "AI Buddy Chat",
    description: "Ask questions in Urdu, Hindi, Punjabi or English. Send a screenshot where supported.",
    to: "/" as const,
    icon: Bot,
    status: "Main assistant",
  },
  {
    title: "Marketing & Music Studio",
    description: "Prepare promotional ideas, captions, campaign drafts and music-video storyboards.",
    to: "/studio" as const,
    icon: WandSparkles,
    status: "Draft tools",
  },
  {
    title: "Business Manager",
    description: "Organise business ideas, customer notes and simple business plans.",
    to: "/business-manager" as const,
    icon: BriefcaseBusiness,
    status: "Helper tools",
  },
  {
    title: "Manager AI",
    description: "Get practical guidance for business decisions and customer communication.",
    to: "/manager-ai" as const,
    icon: Sparkles,
    status: "AI connection may be needed",
  },
  {
    title: "Mini Software Builder",
    description: "Plan a small app or customer tool and prepare a starter specification.",
    to: "/software-builder" as const,
    icon: Code2,
    status: "Planning tool",
  },
  {
    title: "Song Studio",
    description: "Create original song lyrics and develop a music idea.",
    to: "/song" as const,
    icon: Music,
    status: "Lyrics drafts",
  },
];

type Readiness = { chatProvider: string; freeHelper: string; openEndedChatReady: boolean; songAudioGeneration: string; socialAutoPublishing: string; customerPayments: string };

function Dashboard() {
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/status").then((response) => response.ok ? response.json() as Promise<Readiness> : null)
      .then((value) => { if (active && value) setReadiness(value); })
      .catch(() => { if (active) setReadiness(null); });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-dvh bg-glow px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-7 flex items-center gap-3">
          <div className="orb lotus grid size-12 shrink-0 place-items-center rounded-2xl">
            <LayoutDashboard className="size-6 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">One place for your tools</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Buddy Dashboard</h1>
          </div>
          <Link to="/" className="rounded-xl bg-secondary px-3 py-2 text-sm font-semibold">Chat</Link>
        </header>

        <section className="mb-6 rounded-3xl border border-border bg-card/80 p-4 sm:p-5">
          <h2 className="font-semibold">Welcome to AI Buddy</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Open all the current tools from this one dashboard. Some tools prepare drafts or plans; features that need an AI provider or an outside account will only work after that connection is configured and tested.
          </p>
        </section>

        <section className="mb-6 rounded-3xl border border-border bg-card/80 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Current setup</h2>
            <span className="text-xs text-muted-foreground">{readiness ? "Server status checked" : "Checking setup…"}</span>
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <p>Free helper: <strong>{readiness?.freeHelper === "available" ? "Ready" : "Checking"}</strong></p>
            <p>Full AI chat: <strong>{readiness?.openEndedChatReady ? (readiness.chatProvider === "gemini" ? "Gemini key set" : "Gateway key set") : "Needs provider key"}</strong></p>
            <p>Sung audio: <strong>{readiness?.songAudioGeneration === "not-connected" ? "Not connected" : "Not checked"}</strong></p>
            <p>Automatic social posting: <strong>{readiness?.socialAutoPublishing === "not-connected" ? "Not connected" : "Not checked"}</strong></p>
            <p>Customer payments: <strong>{readiness?.customerPayments === "not-configured" ? "Not configured" : "Not checked"}</strong></p>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">This checks whether server settings exist. It does not prove that an AI key works or that a payment or social account is connected.</p>
        </section>

        <section className="mb-7">
          <div className="mb-3">
            <h2 className="text-lg font-bold">Four Main AI Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">The four core services of the AI Buddy business.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {mainServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  to={service.to}
                  className="group flex min-h-44 flex-col rounded-3xl border border-primary/20 bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-2xl bg-secondary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs text-muted-foreground">{service.status}</span>
                  </div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{service.description}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open service <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Other AI Buddy Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  to={tool.to}
                  className="group flex min-h-40 flex-col rounded-3xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-2xl bg-secondary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs text-muted-foreground">{tool.status}</span>
                  </div>
                  <h3 className="font-semibold">{tool.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open tool <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          No automatic posting, customer messaging or paid service is activated from this dashboard.
        </p>
      </div>
    </main>
  );
}
