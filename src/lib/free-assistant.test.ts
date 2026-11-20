import { describe, expect, it } from "vitest";
import { getFreeAssistantReply, getFreeProviderUnavailableReply } from "./free-assistant";

describe("free assistant", () => {
  it("answers basic greetings without an AI provider", () => {
    expect(getFreeAssistantReply("hello", "en")).toContain("Hello");
    expect(getFreeAssistantReply("السلام علیکم", "ur")).toContain("السلام علیکم");
  });

  it("answers feature and pricing FAQs without inventing live capabilities or prices", () => {
    expect(getFreeAssistantReply("What features do you have?", "en")).toContain("still being built");
    expect(getFreeAssistantReply("What are the packages and price?", "en")).toContain("not activated yet");
  });

  it("creates a fixed promotional draft and sharing instructions", () => {
    expect(getFreeAssistantReply("Make a marketing post", "en")).toContain("Meet AI Buddy");
    expect(getFreeAssistantReply("How do I share the link?", "en")).toContain("WhatsApp");
  });

  it("returns null for open-ended requests that need a real model", () => {
    expect(getFreeAssistantReply("Write a detailed business plan for my shop", "en")).toBeNull();
    expect(getFreeProviderUnavailableReply("hi")).toContain("real AI model");
  });

  it("supports Hindi and Roman Urdu responses", () => {
    expect(getFreeAssistantReply("price kya hai?", "hi")).toContain("मुफ्त");
    expect(getFreeAssistantReply("marketing post banao", "roman-ur")).toContain("AI Buddy se miliye");
  });
});
