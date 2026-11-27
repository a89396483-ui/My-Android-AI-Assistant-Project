import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bot, BriefcaseBusiness, LayoutDashboard, Megaphone, MessageCircle, ShieldCheck, Sparkles, Users, WandSparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "AI Buddy — Dashboard" },
      { name: "description", content: "Open AI Buddy's three core business tools." },
    ],
  }),
  component: Dashboard,
});

const mainServices = [
  {
    title: "Shopkeeper Helper",
    description: "Manage shop details, products and prices, record sales and expenses, track customer enquiries and prepare simple business reports.",
    to: "/business-manager" as const,
    icon: BriefcaseBusiness,
    status: "Shop workspace",
  },
  {
    title: "Customer Message Helper",
    description: "Prepare polite Urdu, Hindi, Punjabi and English replies to customer questions, save enquiries and hand important conversations to the shop owner.",
    to: "/business-manager" as const,
    icon: MessageCircle,
    status: "Reply drafts",
  },
  {
    title: "Marketing Tool",
    description: "Create business posts, offers, captions and a low-cost marketing plan. Review each post before publishing; social account connection is not active yet.",
    to: "/marketing-manager" as const,
    icon: Megaphone,
    status: "Create and test posts",
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
    title: "Backup & Restore",
    description: "Download a copy of your business records or restore them on this phone.",
    to: "/backup" as const,
    icon: ShieldCheck,
    status: "Protect your data",
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
    icon: Users,
    status: "Planning tool",
  },
  {
    title: "Song Studio",
    description: "Create original song lyrics and develop a music idea.",
    to: "/song" as const,
    icon: Sparkles,
    status: "Lyrics drafts",
  },
];

type FeatureStatus = { id: string; name: string; status: string; detail: string };
type Readiness = { chatProvider: string; freeHelper: string; openEndedChatReady: boolean; songAudioGeneration: string; socialAutoPublishing: string; customerPayments: string; features?: FeatureStatus[]; note?: string };

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
            Start with these three core services. Some actions prepare drafts or save records on this phone; live AI, social publishing and payment connections must be configured and tested separately.
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
            <p>Song audio: <strong>{readiness?.songAudioGeneration === "not-connected" ? "Not connected" : "Not checked"}</strong></p>
            <p>Automatic social posting: <strong>{readiness?.socialAutoPublishing === "not-connected" ? "Not connected" : "Not checked"}</strong></p>
            <p>Customer payments: <strong>{readiness?.customerPayments === "not-configured" ? "Not configured" : "Not checked"}</strong></p>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">This checks whether server settings exist. It does not prove that an AI key works or that a payment or social account is connected.</p>
        </section>

        <section className="mb-7 rounded-3xl border border-border bg-card/80 p-4 sm:p-5">
          <h2 className="font-semibold">AI Buddy — Full Work Checklist</h2>
          <p className="mt-1 text-sm text-muted-foreground">یہ فہرست بتاتی ہے کہ کیا بنا ہے اور کیا باقی ہے۔</p>
          <div className="mt-4 space-y-3">
            {readiness?.features?.map((feature) => (
              <div key={feature.id} className="border-b border-border/70 pb-3 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-sm">{feature.name}</strong>
                  <span className="rounded-full bg-secondary px-2 py-1 text-xs">{feature.status}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{feature.detail}</p>
              </div>
            )) ?? <p className="text-sm text-muted-foreground">فہرست لوڈ ہو رہی ہے۔ صفحہ دوبارہ کھولیں۔</p>}
          </div>
          {readiness?.note && <p className="mt-4 text-xs leading-5 text-muted-foreground">{readiness.note}</p>}
        </section>

        <section className="mb-7">
          <div className="mb-3">
            <h2 className="text-lg font-bold">Three Main AI Services</h2>
            <p className="mt-1 text-sm text-muted-foreground">Shop management, customer replies and marketing — built into the existing AI Buddy project.</p>
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
