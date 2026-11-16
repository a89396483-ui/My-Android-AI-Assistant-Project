export type BusinessProfile = {
  name: string;
  service: string;
  area: string;
  publicContact: string;
  ownerContact: string;
  language: string;
};

export type BusinessLead = {
  id: string;
  name: string;
  contact: string;
  need: string;
  createdAt: string;
};

export const BUSINESS_CAPABILITIES = [
  "Marketing content and campaign drafts",
  "Business information and FAQ reply drafts",
  "Manual customer enquiry records",
  "Lead notes and order enquiry records",
  "Owner handoff planning for serious enquiries",
  "On-device income and expense records",
  "Basic business planning tips",
] as const;

export function makeCapabilityReply(enabled: string[] = [...BUSINESS_CAPABILITIES]) {
  return [
    "Welcome! Here are the business services currently configured:",
    ...enabled.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Tell us what you need help with and our team will guide you.",
  ].join("\n");
}

export function makeMarketingDraft(profile: BusinessProfile, offer: string) {
  const business = profile.name.trim() || "Our Business";
  const service = profile.service.trim() || "our services";
  const area = profile.area.trim();
  const contact = profile.publicContact.trim();
  const location = area ? ` in ${area}` : "";
  const contactLine = contact ? `\nContact: ${contact}` : "";
  const offerLine = offer.trim() ? `\nSpecial offer: ${offer.trim()}` : "";
  return [
    `✨ Discover ${business}!`,
    `We provide ${service}${location}.`,
    "Friendly service and clear information — message us to learn more.",
    offerLine,
    contactLine,
    "",
    "#SmallBusiness #CustomerCare",
  ].filter(Boolean).join("\n");
}

export function routeManagerRequest(message: string) {
  const value = message.toLowerCase();
  if (/market|post|advert|promotion|campaign/.test(value)) return "marketing";
  if (/customer|client|lead|find people/.test(value)) return "leads";
  if (/reply|message|chat|conversation/.test(value)) return "replies";
  if (/owner|owner contact|phone|call me|handoff/.test(value)) return "handoff";
  if (/account|income|expense|profit|money/.test(value)) return "accounts";
  if (/setting|permission|number|profile/.test(value)) return "settings";
  if (/order|booking/.test(value)) return "orders";
  if (/teach|learn|business idea|start business/.test(value)) return "teacher";
  return "overview";
}

export type AccountEntry = {
  id: string;
  kind: "income" | "expense";
  amount: number;
  note: string;
  date: string;
};

export function summarizeAccounts(entries: AccountEntry[]) {
  const income = entries.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expenses = entries.filter((entry) => entry.kind === "expense").reduce((sum, entry) => sum + entry.amount, 0);
  return { income, expenses, balance: income - expenses };
}


export type MarketingBrief = {
  platform: string;
  objective: string;
  audience: string;
  tone: string;
  language: string;
  offer: string;
};

export function makeMarketingCampaign(profile: BusinessProfile, brief: MarketingBrief) {
  const business = profile.name.trim() || "Our Business";
  const service = profile.service.trim() || "our products and services";
  const area = profile.area.trim();
  const contact = profile.publicContact.trim();
  const objectiveLine = brief.objective === "sales" ? "Ready to order? Get in touch today." : brief.objective === "messages" ? "Send us a message and ask your questions." : "Discover what we offer and follow our page for updates.";
  const languageNote = brief.language === "Urdu" ? "اردو میں شائع کرنے سے پہلے اپنے کاروبار کی درست تفصیلات ضرور شامل کریں۔" : brief.language === "Roman Urdu" ? "Roman Urdu version: Humein message karein aur mazeed maloomat hasil karein." : "";
  const offerLine = brief.offer.trim() ? `Offer: ${brief.offer.trim()}` : "";
  const contactLine = contact ? `Contact: ${contact}` : "Contact: Add your public business contact before publishing.";
  const locationLine = area ? `Service area: ${area}` : "";
  const post = [
    `🌟 ${business}`,
    `${service} — ${locationLine || "Here to help you"}.`,
    offerLine,
    objectiveLine,
    contactLine,
    languageNote,
    "#SmallBusiness #CustomerCare",
  ].filter(Boolean).join("\\n");
  const schedule = [
    { day: "Day 1", task: "Introduce your business and the problem you solve." },
    { day: "Day 2", task: "Share one useful tip related to your service." },
    { day: "Day 3", task: "Show a product or explain how your service works." },
    { day: "Day 4", task: "Answer one common customer question." },
    { day: "Day 5", task: brief.offer.trim() ? `Explain the offer: ${brief.offer.trim()}.` : "Share a clear benefit and invite questions." },
    { day: "Day 6", task: "Share a genuine customer review only with permission." },
    { day: "Day 7", task: "Repeat the best-performing message with a clear call to action." },
  ];
  return { post, platform: brief.platform, objective: brief.objective, audience: brief.audience.trim() || "Local customers", tone: brief.tone, language: brief.language, schedule };
}
