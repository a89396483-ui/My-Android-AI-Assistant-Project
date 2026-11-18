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
  ].filter(Boolean).join("\n");
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


export const SOCIAL_CHANNELS = [
  { id: "facebook", label: "Facebook", format: "Community post", guidance: "Use a clear service benefit, local area and message call-to-action." },
  { id: "instagram", label: "Instagram", format: "Caption + Reel idea", guidance: "Lead with a short hook, then benefits and a few relevant hashtags." },
  { id: "x", label: "X (Twitter)", format: "Short post", guidance: "Keep it concise, specific and conversation-friendly." },
  { id: "tiktok", label: "TikTok", format: "Short-video script", guidance: "Start with a problem in the first seconds, show the result and invite a question." },
  { id: "youtube", label: "YouTube", format: "Shorts title + description", guidance: "Use a searchable title and explain the practical result." },
  { id: "whatsapp", label: "WhatsApp Status", format: "Status sequence", guidance: "Use short slides with one service and one call-to-action each." },
] as const;

export type SocialCampaignInput = {
  businessName: string;
  services: string;
  area: string;
  publicContact: string;
  offer: string;
  language: string;
};

export function buildSocialChannelPosts(input: SocialCampaignInput) {
  const name = input.businessName.trim() || "AI Buddy";
  const services = input.services.trim() || "AI-powered help with everyday digital tasks";
  const area = input.area.trim();
  const contact = input.publicContact.trim() || "Message this page for details";
  const offer = input.offer.trim();
  const lang = input.language;
  const intro = lang === "Urdu"
    ? `${name} کے ساتھ اپنے ڈیجیٹل کام آسان بنائیں!`
    : lang === "Roman Urdu"
      ? `${name} ke saath apne digital kaam asaan banayein!`
      : `Make everyday digital work easier with ${name}!`;
  const detail = lang === "Urdu"
    ? `ہم مدد کرتے ہیں: ${services}۔`
    : lang === "Roman Urdu"
      ? `Hum madad karte hain: ${services}.`
      : `We can help with: ${services}.`;
  const areaLine = area ? (lang === "Urdu" ? `علاقہ: ${area}` : `Area: ${area}`) : "";
  const offerLine = offer ? (lang === "Urdu" ? `خاص آفر: ${offer}` : `Offer: ${offer}`) : "";
  const cta = lang === "Urdu" ? `تفصیل کے لیے رابطہ کریں: ${contact}` : `Contact us: ${contact}`;
  const base = [intro, detail, areaLine, offerLine, cta].filter(Boolean).join("\n\n");
  return [
    { id: "facebook", label: "Facebook", format: "Community post", text: `${base}\n\n#SmallBusiness #DigitalHelp #AIBuddy` },
    { id: "instagram", label: "Instagram", format: "Caption + Reel idea", text: `✨ ${intro}\n\n${detail}\n${offerLine}\n${cta}\n\n#AIBuddy #DigitalServices #WorkSmart #SmallBusiness\n\nReel idea: show a common task, then show how AI Buddy helps prepare it.` },
    { id: "x", label: "X (Twitter)", format: "Short post", text: `${name}: ${services}. ${offerLine} ${contact} #AIBuddy`.trim() },
    { id: "tiktok", label: "TikTok", format: "Short-video script", text: `Hook: "Still doing this digital task the hard way?"\nShow: ${services}.\nExplain: AI Buddy helps prepare the work; review the result before using it.\nCTA: ${contact}\nCaption: ${intro}` },
    { id: "youtube", label: "YouTube Shorts", format: "Title + description", text: `Title: How AI Buddy helps with ${services}\n\nDescription: ${base}\n\n#Shorts #AIBuddy` },
    { id: "whatsapp", label: "WhatsApp Status", format: "3-slide status", text: `Slide 1: ${intro}\nSlide 2: ${detail}\nSlide 3: ${offerLine || cta}\nReply/message: ${contact}` },
  ];
}

export const CUSTOMER_SEGMENTS = [
  { id: "documents", title: "CV and document help", who: "Job seekers, students and people who need a CV, application letter, forms or formatted files.", need: "Prepare or improve a document quickly.", searches: ["Karachi job seekers groups", "students needing CV help Karachi", "small businesses needing document formatting"], offer: "CV, application and document preparation support" },
  { id: "small-business", title: "Small business marketing", who: "Shopkeepers, home businesses, service providers and local sellers.", need: "Social posts, offers, captions and customer replies.", searches: ["Karachi small business owners", "home businesses Karachi", "local service providers Karachi"], offer: "Affordable social media content and marketing drafts" },
  { id: "job-business", title: "Recruitment and job advertisers", who: "Recruiters, training centres and businesses that publish genuine job vacancies.", need: "Clear job ads, vacancy graphics text and application information.", searches: ["Karachi recruitment agencies", "Karachi training institutes hiring", "businesses posting job vacancies Karachi"], offer: "Job advertisement writing and recruitment post preparation" },
  { id: "creators", title: "Creators and freelancers", who: "Content creators, freelancers and small agencies.", need: "Content ideas, scripts, profiles and promotional material.", searches: ["Karachi freelancers", "Pakistan content creators", "small digital agencies Pakistan"], offer: "Content ideas, scripts and promotional copy" },
] as const;

export function getCustomerProspectingPlan(area = "Karachi") {
  return CUSTOMER_SEGMENTS.map((segment) => ({
    ...segment,
    searches: segment.searches.map((query) => query.replaceAll("Karachi", area)),
    outreach: `Hello! We help with ${segment.offer.toLowerCase()}. I noticed your work may involve this kind of task. Would you like to see a small sample? No pressure. If not relevant, we will not follow up.`,
  }));
}


export type ViralCampaignInput = {
  type: "business" | "music";
  name: string;
  audience: string;
  platform: string;
  language: string;
  goal: string;
  details: string;
  callToAction: string;
  rightsConfirmed: boolean;
};

export function buildViralCampaign(input: ViralCampaignInput) {
  const name = input.name.trim() || (input.type === "music" ? "New song" : "Our business");
  const audience = input.audience.trim() || "people interested in this topic";
  const details = input.details.trim() || (input.type === "music" ? "a short preview of the song" : "a real demonstration of the service");
  const cta = input.callToAction.trim() || (input.type === "music" ? "Listen and share if you like it" : "Message us to learn more");
  const music = input.type === "music";
  const hooks = music
    ? [`“Wait for the line that says it all…” — ${name}`, `A 10-second feeling for anyone who has lived this story.`, `Which part should become the full video: the hook or the chorus?`]
    : [`“Still struggling with this? Watch this.”`, `One common problem. One clear, practical solution.`, `Here is what changes when you do this the simpler way.`];
  const script = [
    `0–2 sec — HOOK: ${hooks[0]}`,
    music ? `2–7 sec — PLAY: use an authorized 5–10 second song excerpt; show the title and artist clearly.` : `2–7 sec — SHOW: demonstrate the real problem, without exaggerated claims.`,
    `7–18 sec — STORY: ${details}`,
    music ? `18–25 sec — INVITE: ask viewers which lyric or moment they remember.` : `18–25 sec — PROOF: show a real example or explain one useful detail.`,
    `Final — CTA: ${cta}`,
  ].join("\n");
  const caption = music
    ? `${name} 🎧\nA small preview for ${audience}. Listen, tell us your favourite moment, and share it with someone who may connect with it.\n${cta}`
    : `${name} ✨\nMade for ${audience}. ${details}\n${cta}`;
  const experiments = [
    "Version A: emotional / problem-first opening",
    "Version B: question / curiosity opening",
    "Version C: direct demonstration / strongest moment first",
  ];
  return {
    title: name,
    type: input.type,
    platform: input.platform,
    audience,
    hooks,
    script,
    caption,
    experiments,
    rightsNote: music
      ? input.rightsConfirmed
        ? "Rights confirmation marked by owner. Keep proof of ownership/licence and follow each platform's music rules."
        : "Do not publish yet: confirm ownership or written permission for the recording, composition, vocals, artwork and any samples."
      : "Use genuine demonstrations, customer permissions and accurate claims.",
    publishNote: "Draft only. Owner review and approval are required before publishing. No platform is connected or auto-publishing from this preview.",
  };
}

export type CampaignMetrics = {
  views: number;
  averageWatchSeconds: number;
  shares: number;
  saves: number;
  comments: number;
  inquiries: number;
};

export function reviewCampaignMetrics(metrics: CampaignMetrics) {
  const signals = [
    { label: "Views", value: metrics.views },
    { label: "Average watch (sec)", value: metrics.averageWatchSeconds },
    { label: "Shares", value: metrics.shares },
    { label: "Saves", value: metrics.saves },
    { label: "Comments", value: metrics.comments },
    { label: "Inquiries / listens", value: metrics.inquiries },
  ];
  const interactions = metrics.shares + metrics.saves + metrics.comments;
  const engagement = metrics.views > 0 ? (interactions / metrics.views) * 100 : 0;
  const advice = metrics.views === 0
    ? "Add the results after the post has been published; do not guess missing numbers."
    : metrics.averageWatchSeconds < 5
      ? "Test a clearer first 1–2 seconds and show the strongest moment earlier."
      : metrics.shares + metrics.saves === 0
        ? "Make the clip more useful or emotionally relatable, then test a clearer share/save reason."
        : metrics.inquiries === 0
          ? "Keep the creative idea, but make the next-step invitation clearer and easier."
          : "Repeat the strongest angle with a fresh opening; track whether qualified inquiries continue.";
  return { signals, engagement, advice };
}
