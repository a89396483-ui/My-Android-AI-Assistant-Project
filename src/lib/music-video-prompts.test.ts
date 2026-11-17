import { describe, expect, it } from "vitest";
import { buildMusicVideoStoryboard, buildProviderPrompt } from "./music-video-prompts";
import type { MusicVideoBrief } from "./music-video-studio";

const brief: MusicVideoBrief = {
  projectId: "project-1",
  songAssetId: "song-1",
  prompt: "Rainy night, emotional city story",
  language: "ur",
  format: "9:16",
  durationSeconds: 20,
  resolution: "720p",
  includeLyrics: true,
  includeLipSync: false,
  fictionalPerformersOnly: true,
};

describe("music video storyboard planner", () => {
  it("creates timed scenes that end at the selected duration", () => {
    const storyboard = buildMusicVideoStoryboard(brief);
    expect(storyboard.scenes[0]?.startSecond).toBe(0);
    expect(storyboard.scenes.at(-1)?.endSecond).toBe(20);
    expect(storyboard.scenes).toHaveLength(3);
  });

  it("keeps duration inside the supported 6 to 60 second range", () => {
    expect(buildMusicVideoStoryboard({ ...brief, durationSeconds: 200 }).durationSeconds).toBe(60);
    expect(buildMusicVideoStoryboard({ ...brief, durationSeconds: 1 }).durationSeconds).toBe(6);
  });

  it("adds rights and fictional-performer safety notes", () => {
    const storyboard = buildMusicVideoStoryboard(brief);
    expect(storyboard.safetyNotes.join(" ")).toContain("fictional");
    expect(storyboard.safetyNotes.join(" ")).toContain("licensed");
  });

  it("builds a provider-neutral prompt from the owner's direction", () => {
    const storyboard = buildMusicVideoStoryboard(brief);
    const prompt = buildProviderPrompt(brief, storyboard);
    expect(prompt).toContain("Rainy night, emotional city story");
    expect(prompt).toContain("9:16");
    expect(prompt).toContain("owner-provided/approved lyrics");
  });
});
