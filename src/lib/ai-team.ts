export const AI_TEAM = [
  { id: "manager", name: "AI Buddy Manager", role: "Coordinates work and routes requests to the right specialist." },
  { id: "opportunity", name: "Opportunity Finder", role: "Researches lawful public opportunities and prepares evidence-based briefs." },
  { id: "inbox", name: "Customer Inbox Agent", role: "Classifies customer messages and drafts replies for owner review." },
  { id: "builder", name: "Software Builder", role: "Plans and implements software changes on the approved feature branch." },
  { id: "qa", name: "QA & Security Agent", role: "Reviews code, tests, privacy, permissions and release readiness." },
  { id: "marketing", name: "Marketing Agent", role: "Creates truthful AI Buddy product marketing drafts and calendars." },
  { id: "sales", name: "Sales Agent", role: "Prepares personalized sales follow-ups and demo plans; no unsolicited bulk outreach." },
  { id: "finance", name: "Finance & Operations Agent", role: "Tracks owner-entered costs, budgets and operational tasks." },
  { id: "music", name: "Music Promotion Agent", role: "Plans campaigns for the owner's music, short-video hooks, captions and performance experiments." },
] as const;

export type AIAgentId = (typeof AI_TEAM)[number]["id"];

const MATCHERS: Array<{ id: AIAgentId; pattern: RegExp }> = [
  { id: "music", pattern: /song|music|singer|artist|track|lyrics|گانا|موسیقی|گانے|آواز/iu },
  { id: "marketing", pattern: /market|promotion|campaign|post|caption|hashtag|اشتہار/iu },
  { id: "inbox", pattern: /inbox|customer message|reply|complaint|رسائ|جواب|پیغام/iu },
  { id: "sales", pattern: /sales|sell|customer|client|lead|خریدار|گاہک/iu },
  { id: "finance", pattern: /budget|expense|income|profit|cost|خرچ|آمدنی/iu },
  { id: "builder", pattern: /code|bug|build|website|app|apk|software|کوڈ|ایپ/iu },
  { id: "qa", pattern: /test|security|privacy|review|audit|ٹیسٹ/iu },
  { id: "opportunity", pattern: /opportunity|research|find work|job|موقع|کام تلاش/iu },
];

export function routeToAgent(message: string): AIAgentId {
  return MATCHERS.find(({ pattern }) => pattern.test(message))?.id ?? "manager";
}

export function getAgentBrief(agentId: AIAgentId) {
  const agent = AI_TEAM.find(({ id }) => id === agentId);
  if (!agent) throw new Error("Unknown AI team member.");
  return [
    `You are the ${agent.name}.`,
    agent.role,
    "Use only information and tools actually available in this session.",
    "Never claim an action was completed without a confirmed result.",
    "Ask the owner before publishing, contacting people, spending money, changing accounts, merging, deploying or releasing.",
    "Do not promise virality, guaranteed sales or guaranteed earnings.",
    "Protect personal data and use only authorized, consented information.",
  ].join("\n");
}

export const OWNER_AND_REVIEWERS = [
  { id: "owner", name: "Ashraf", role: "Owner; final approval for external actions and spending." },
  { id: "reviewer", name: "ChatGPT", role: "External planning, review and coordination assistant; not an autonomous account." },
] as const;
