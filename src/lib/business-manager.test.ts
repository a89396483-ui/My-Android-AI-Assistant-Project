import { describe, expect, it } from "vitest";
import { buildSocialChannelPosts, getCustomerProspectingPlan, makeCapabilityReply, makeMarketingCampaign, makeMarketingDraft, routeManagerRequest, summarizeAccounts, type BusinessProfile } from "./business-manager";

const profile: BusinessProfile = {
  name: "Ashraf Services",
  service: "home cleaning",
  area: "Karachi",
  publicContact: "0300-0000000",
  ownerContact: "",
  language: "Urdu",
};

describe("Business Manager helpers", () => {
  it("routes common owner requests to the correct specialist", () => {
    expect(routeManagerRequest("Please make a marketing post")).toBe("marketing");
    expect(routeManagerRequest("Find new customers")).toBe("leads");
    expect(routeManagerRequest("Show my expenses")).toBe("accounts");
    expect(routeManagerRequest("Open my settings")).toBe("settings");
  });

  it("creates a marketing draft using the configured business details", () => {
    const draft = makeMarketingDraft(profile, "10% off this week");
    expect(draft).toContain("Ashraf Services");
    expect(draft).toContain("home cleaning");
    expect(draft).toContain("Karachi");
    expect(draft).toContain("10% off this week");
    expect(draft).toContain("0300-0000000");
  });


  it("builds a campaign post and a seven-day content plan", () => {
    const campaign = makeMarketingCampaign(profile, {
      platform: "Facebook / Instagram",
      objective: "messages",
      audience: "families in Karachi",
      tone: "Friendly",
      language: "Urdu",
      offer: "10% off",
    });
    expect(campaign.post).toContain("Ashraf Services");
    expect(campaign.post).toContain("10% off");
    expect(campaign.post).toContain("0300-0000000");
    expect(campaign.audience).toBe("families in Karachi");
    expect(campaign.schedule).toHaveLength(7);
    expect(campaign.schedule[0].day).toBe("Day 1");
  });


  it("creates separate post formats for the main social channels", () => {
    const posts = buildSocialChannelPosts({
      businessName: "AI Buddy",
      services: "CVs, document files and social marketing",
      area: "Karachi",
      publicContact: "Public page inbox",
      offer: "Free sample",
      language: "English",
    });
    expect(posts.map((post) => post.id)).toEqual(["facebook", "instagram", "x", "tiktok", "youtube", "whatsapp"]);
    expect(posts.find((post) => post.id === "facebook")?.text).toContain("AI Buddy");
    expect(posts.find((post) => post.id === "tiktok")?.text).toContain("Hook:");
  });

  it("provides customer segments and consent-respecting intro drafts", () => {
    const plan = getCustomerProspectingPlan("Lahore");
    expect(plan.length).toBeGreaterThanOrEqual(4);
    expect(plan[0].searches[0]).toContain("Lahore");
    expect(plan[0].outreach).toContain("No pressure");
  });

  it("summarizes income, expenses and balance", () => {
    expect(summarizeAccounts([
      { id: "1", kind: "income", amount: 5000, note: "Sale", date: "today" },
      { id: "2", kind: "expense", amount: 1200, note: "Stock", date: "today" },
    ])).toEqual({ income: 5000, expenses: 1200, balance: 3800 });
  });

  it("lists only the capabilities passed to the customer reply", () => {
    const reply = makeCapabilityReply(["Customer enquiry handling"]);
    expect(reply).toContain("Customer enquiry handling");
    expect(reply).not.toContain("Marketing posts");
  });
});
