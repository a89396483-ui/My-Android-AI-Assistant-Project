export type MusicVideoJobStatus =
  | "draft"
  | "awaiting_approval"
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type MusicVideoFormat = "9:16" | "1:1" | "16:9";

export interface MusicVideoBrief {
  projectId: string;
  songAssetId: string;
  prompt: string;
  language: "ur" | "hi" | "pa" | "en" | "auto";
  format: MusicVideoFormat;
  durationSeconds: number;
  resolution: "draft" | "720p" | "1080p";
  includeLyrics: boolean;
  includeLipSync: boolean;
  fictionalPerformersOnly: boolean;
}

export interface MusicVideoCostEstimate {
  providerId: string;
  modelId: string;
  currency: string;
  amount: number;
  estimatedCredits?: number;
  durationSeconds: number;
  resolution: MusicVideoBrief["resolution"];
  expiresAt: string;
}

export interface MusicVideoApproval {
  approvedBy: string;
  approvedAt: string;
  estimateId: string;
  maximumAmount: number;
  currency: string;
}

export interface MusicVideoJob {
  id: string;
  projectId: string;
  brief: MusicVideoBrief;
  status: MusicVideoJobStatus;
  estimate?: MusicVideoCostEstimate;
  approval?: MusicVideoApproval;
  providerJobId?: string;
  previewUrl?: string;
  actualCost?: { amount: number; currency: string };
  errorCode?: string;
  createdAt: string;
  updatedAt: string;
}

/** Provider adapters must estimate before generation and accept an explicit approved cap. */
export interface MusicVideoProvider {
  readonly id: string;
  estimate(brief: MusicVideoBrief): Promise<MusicVideoCostEstimate>;
  generate(input: {
    brief: MusicVideoBrief;
    estimate: MusicVideoCostEstimate;
    approval: MusicVideoApproval;
    idempotencyKey: string;
  }): Promise<{ providerJobId: string }>;
  getJob(providerJobId: string): Promise<{
    status: Exclude<MusicVideoJobStatus, "draft" | "awaiting_approval">;
    previewUrl?: string;
    actualCost?: { amount: number; currency: string };
    errorCode?: string;
  }>;
}

/** Enforces an explicit approval matching the estimate and its maximum spend. */
export function canStartMusicVideoGeneration(
  estimate: MusicVideoCostEstimate,
  approval: MusicVideoApproval | undefined,
  now = new Date(),
): boolean {
  if (!approval) return false;
  if (Date.parse(estimate.expiresAt) <= now.getTime()) return false;
  if (approval.estimateId !== estimate.providerId + ":" + estimate.modelId + ":" + estimate.expiresAt) {
    return false;
  }
  if (approval.currency !== estimate.currency) return false;
  if (!Number.isFinite(approval.maximumAmount) || approval.maximumAmount < estimate.amount) {
    return false;
  }
  return true;
}

/** Stable identifier used by the approval screen and job submission. */
export function getMusicVideoEstimateId(estimate: MusicVideoCostEstimate): string {
  return estimate.providerId + ":" + estimate.modelId + ":" + estimate.expiresAt;
}
