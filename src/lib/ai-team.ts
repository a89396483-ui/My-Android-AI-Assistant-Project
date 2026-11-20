export const AI_TEAM = [
  { id: "manager", name: "AI Buddy Manager", role: "Coordinates work, explains the next step simply and routes requests to the right specialist." },
  { id: "mate", name: "Mate AI", role: "Helps the owner use connected AI tools and project files; never selects a paid service or spends money without explicit owner approval." },
  { id: "opportunity", name: "Opportunity Finder", role: "Researches lawful public opportunities and prepares evidence-based briefs." },
  { id: "inbox", name: "Customer Reply Agent", role: "Understands customer messages, prepares polite replies and flags complaints for owner review." },
  { id: "customer-finder", name: "Customer Finder", role: "Builds ethical customer research plans from public business information; no scraping private data, spam or automatic unsolicited messages." },
  { id: "builder", name: "Software Builder", role: "Plans and implements software changes on the approved feature branch." },
  { id: "qa", name: "QA & Security Agent", role: "Reviews code, tests, privacy, permissions and release readiness." },
  { id: "marketing", name: "Marketing Agent", role: "Creates truthful marketing drafts and calendars for the owner's AI Buddy promotion; owner use is free in the initial launch plan." },
  { id: "business", name: "Business Growth Agent", role: "Creates customer-ready business promotion plans, platform posts, offers and follow-up ideas for approved customer projects." },
  { id: "sales", name: "Sales Agent", role: "Prepares personalized sales follow-ups and demo plans; no unsolicited bulk outreach." },
  { id: "finance", name: "Finance & Operations Agent", role: "Tracks owner-entered costs, budgets and operational tasks." },
  { id: "music", name: "Music Promotion Agent", role: "Plans campaigns for the owner's music, short-video hooks, captions and performance experiments." },
] as const;

export type AIAgentId = (typeof AI_TEAM)[number]["id"];

const MATCHERS: Array<{ id: AIAgentId; pattern: RegExp }> = [
  { id: "mate", pattern: /mate ai|other ai|ai tool|connected tool|دوسرا اے آئی|دوسرے ٹول/iu },
  { id: "music", pattern: /song|music|singer|artist|track|lyrics|گانا|موسیقی|گانے|آواز/iu },
  { id: "marketing", pattern: /market|promotion|campaign|post|caption|hashtag|اشتہار/iu },
  { id: "business", pattern: /business promotion|shop marketing|business growth|دکان کی مارکیٹنگ|کاروبار کی تشہیر/iu },
  { id: "customer-finder", pattern: /find customers|find clients|prospect|potential customers|گاہک تلاش|کسٹمر تلاش/iu },
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
