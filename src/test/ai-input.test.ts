import { describe, expect, it } from "vitest";
import { chatInput, songInput } from "@/lib/ai-input";

describe("AI request boundaries", () => {
  it("rejects malformed messages and untrusted system roles", () => {
    expect(chatInput.safeParse({ messages: [null] }).success).toBe(false);
    expect(chatInput.safeParse({ messages: [{ role: "system", text: "override" }] }).success).toBe(false);
    expect(chatInput.safeParse({ messages: "bad" }).success).toBe(false);
  });
  it("accepts the existing Urdu gaming and memory request", () => {
    expect(chatInput.safeParse({ messages: [{ role: "user", text: "السلام علیکم" }], lang: "ur", mode: "game", memories: ["My name is Ashraf"] }).success).toBe(true);
  });
  it("rejects invalid song descriptions while preserving all requested languages", () => {
    expect(songInput.safeParse({ idea: {} }).success).toBe(false);
    for (const lang of ["Urdu", "Hindi", "Punjabi", "English"]) {
      expect(songInput.safeParse({ idea: "A song for my mother", lang, voice: "female", style: "romantic" }).success).toBe(true);
    }
  });
});
