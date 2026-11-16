import { describe, expect, it } from "vitest";
import { makeCapabilityReply, makeMarketingDraft, routeManagerRequest, type BusinessProfile } from "./business-manager";

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

  it("lists only the capabilities passed to the customer reply", () => {
    const reply = makeCapabilityReply(["Customer enquiry handling"]);
    expect(reply).toContain("Customer enquiry handling");
    expect(reply).not.toContain("Marketing posts");
  });
});
