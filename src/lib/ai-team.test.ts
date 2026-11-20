import { describe, expect, it } from "vitest";
import { AI_TEAM, OWNER_AND_REVIEWERS, getAgentBrief, routeToAgent } from "./ai-team";

describe("AI team", () => {
  it("registers twelve specialist agents, including the music agent", () => {
    expect(AI_TEAM).toHaveLength(12);
    expect(AI_TEAM.map((agent) => agent.id)).toContain("music");
  });

  it("keeps the owner and ChatGPT separate from the twelve agents", () => {
    expect(OWNER_AND_REVIEWERS.map((person) => person.id)).toEqual(["owner", "reviewer"]);
  });

  it("routes song requests to the dedicated music agent", () => {
    expect(routeToAgent("Please promote my new Punjabi song")).toBe("music");
    expect(routeToAgent("گانے کی تشہیر کے لیے ویڈیو بناؤ")).toBe("music");
  });

  it("routes software, finance and unknown requests safely", () => {
    expect(routeToAgent("Fix the Android APK build")).toBe("builder");
    expect(routeToAgent("Show my monthly expenses")).toBe("finance");
    expect(routeToAgent("Hello")).toBe("manager");
  });

  it("adds approval and truthfulness rules to every agent brief", () => {
    const brief = getAgentBrief("music");
    expect(brief).toContain("Music Promotion Agent");
    expect(brief).toContain("Ask the owner before publishing");
    expect(brief).toContain("Do not promise virality");
  });
});
