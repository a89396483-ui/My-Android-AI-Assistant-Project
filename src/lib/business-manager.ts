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
  "Marketing posts and campaign drafts",
  "Business information and service FAQs",
  "Customer enquiry handling and lead qualification",
  "Lead and order record keeping",
  "Owner handoff for serious enquiries",
  "Basic income and expense records",
  "Business planning and coaching",
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
