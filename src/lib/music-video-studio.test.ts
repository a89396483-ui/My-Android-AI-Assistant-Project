import { describe, expect, it } from "vitest";
import { canStartMusicVideoGeneration, getMusicVideoEstimateId, type MusicVideoCostEstimate, type MusicVideoApproval } from "./music-video-studio";

const estimate: MusicVideoCostEstimate = {
  providerId: "demo-provider",
  modelId: "demo-model",
  currency: "USD",
  amount: 1.25,
  durationSeconds: 10,
  resolution: "720p",
  expiresAt: "2099-01-01T00:00:00.000Z",
};

function approval(overrides: Partial<MusicVideoApproval> = {}): MusicVideoApproval {
  return {
    approvedBy: "owner",
    approvedAt: "2026-01-01T00:00:00.000Z",
    estimateId: getMusicVideoEstimateId(estimate),
    maximumAmount: 1.25,
    currency: "USD",
    ...overrides,
  };
}

describe("music video generation approval", () => {
  it("does not start without explicit approval", () => {
    expect(canStartMusicVideoGeneration(estimate, undefined, new Date("2026-01-01"))).toBe(false);
  });

  it("allows an approval matching the live estimate and cap", () => {
    expect(canStartMusicVideoGeneration(estimate, approval(), new Date("2026-01-01"))).toBe(true);
  });

  it("rejects an approval with a lower spending cap", () => {
    expect(canStartMusicVideoGeneration(estimate, approval({ maximumAmount: 1 }), new Date("2026-01-01"))).toBe(false);
  });

  it("rejects a different estimate or currency", () => {
    expect(canStartMusicVideoGeneration(estimate, approval({ estimateId: "other" }), new Date("2026-01-01"))).toBe(false);
    expect(canStartMusicVideoGeneration(estimate, approval({ currency: "PKR" }), new Date("2026-01-01"))).toBe(false);
  });

  it("rejects expired estimates", () => {
    expect(canStartMusicVideoGeneration(estimate, approval(), new Date("2100-01-01"))).toBe(false);
  });
});
