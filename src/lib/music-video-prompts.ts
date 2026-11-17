import type { MusicVideoBrief } from "./music-video-studio";

export interface StoryboardScene {
  index: number;
  startSecond: number;
  endSecond: number;
  purpose: "hook" | "story" | "music_peak" | "ending";
  visualDirection: string;
  onScreenText?: string;
}

export interface MusicVideoStoryboard {
  title: string;
  format: MusicVideoBrief["format"];
  durationSeconds: number;
  scenes: StoryboardScene[];
  safetyNotes: string[];
}

export function buildMusicVideoStoryboard(brief: MusicVideoBrief): MusicVideoStoryboard {
  const duration = Math.max(6, Math.min(brief.durationSeconds, 60));
  const first = Math.max(2, Math.round(duration * 0.16));
  const second = Math.max(first + 2, Math.round(duration * 0.58));
  const title = brief.prompt.trim().slice(0, 90) || "Music video concept";
  const scenes: StoryboardScene[] = [
    { index: 1, startSecond: 0, endSecond: first, purpose: "hook", visualDirection: "Open immediately on the strongest visual moment. Use a clear subject, readable composition and motion in the first second.", ...(brief.includeLyrics ? { onScreenText: "Show one short, owner-approved lyric line." } : {}) },
    { index: 2, startSecond: first, endSecond: second, purpose: "story", visualDirection: "Develop the requested mood and story with two or three visually consistent shots. Keep the song as the focus." },
    { index: 3, startSecond: second, endSecond: duration, purpose: "ending", visualDirection: "Resolve on the song title or memorable final image. Leave a clean ending for replay." },
  ];
  const safetyNotes = [
    "Use only audio, lyrics, artwork and footage the owner owns or is licensed to use.",
    "Do not imitate a real person's face, voice or identity without documented permission.",
    "Use fictional performers when generating people unless explicit consent is recorded.",
    "Do not promise platform reach, FYP placement or virality.",
  ];
  if (brief.includeLipSync) safetyNotes.push("Lip-sync requires an authorized performer likeness/voice or a clearly fictional character.");
  if (brief.fictionalPerformersOnly) safetyNotes.push("All generated performers must be fictional and must not resemble a real identifiable person.");
  return { title, format: brief.format, durationSeconds: duration, scenes, safetyNotes };
}

export function buildProviderPrompt(brief: MusicVideoBrief, storyboard: MusicVideoStoryboard): string {
  return [
    "Create an original short-form music video.",
    "Owner's creative direction: " + brief.prompt.trim(),
    "Format: " + brief.format + ". Duration: " + storyboard.durationSeconds + " seconds.",
    "Language: " + brief.language + ". Resolution target: " + brief.resolution + ".",
    "Lyrics overlay: " + (brief.includeLyrics ? "yes, use only owner-provided/approved lyrics" : "no") + ".",
    "Lip-sync: " + (brief.includeLipSync ? "requested; use only an authorized or fictional performer" : "not requested") + ".",
    "Storyboard:",
    ...storyboard.scenes.map((scene) => scene.startSecond + "-" + scene.endSecond + "s " + scene.purpose + ": " + scene.visualDirection),
    "Avoid copyrighted characters, copied music-video scenes, watermarks, fake endorsements and real-person impersonation.",
  ].join("\n");
}
