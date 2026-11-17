# AI Music Video Studio

Status: implementation foundation; no video provider, rendering worker, storage, or social publishing integration is active yet.

## Owner experience
Ashraf uploads/selects an authorized song, then describes a video in Urdu, Hindi, Roman Urdu, Punjabi, or English. The studio turns that request into a storyboard and a generation brief. It must show a cost estimate before any paid generation, create a preview, and let Ashraf request revisions in natural language. Only approved previews can enter the publishing queue.

## Separate products and responsibilities
- Nova is the song-creation workspace/provider concept. It creates original song/audio assets; it is not the promotion agent.
- Music Video Studio creates visual assets and short-form edits around an existing authorized song.
- Music Promotion Agent plans campaigns, schedules approved assets, prepares platform-specific copy, and reports results.
- These remain separate workspaces with separate asset ownership, budgets, permissions, and analytics.

## Main workflow
1. Select song and verify ownership/licence, artist identity, cover art, language, release date, and allowed territories.
2. Describe desired video, mood, characters, locations, visual style, aspect ratio, duration, subtitles, and whether lip-sync is required.
3. AI drafts a shot list/storyboard and a provider-neutral generation plan.
4. Display provider, model, resolution, duration, estimated cost, and remaining owner budget before generation.
5. Require explicit owner approval for any paid generation. Never auto-buy credits or silently switch to a paid provider.
6. Generate preview through a configured provider adapter; store provider job ID, status, output URL, cost, and errors.
7. Show preview player and revision prompt. Each regeneration gets a fresh estimate and approval if billable.
8. Owner approves final asset; only then may it be queued for platform publishing.
9. Show post receipt and analytics only when returned by the connected platform.

## Video types
- Lyric videos and animated typography
- Cinematic visualizers and mood videos
- Story-based vertical shorts
- AI-generated performers/actors, clearly fictional and not impersonating real people
- Cover-art motion and audio-reactive visuals
- Teasers, hooks, alternate edits, subtitles and localized versions

## Customer-facing behavior
- Preview before export/publishing
- Clear "AI-generated" disclosure where required or appropriate
- No promise of FYP placement, views, followers, or virality
- No use of a real person's face/voice without permission
- No copyrighted characters, copied music videos, or unlicensed footage
- No fake engagement, bots, engagement pods, or spam
- User can download/export the approved video and delete project assets

## Cost and plans
- App code and storyboard planning can be free to operate only while hosting/model quotas allow.
- Actual generative video usually consumes paid provider credits or compute. The studio must support a no-cost/manual mode and must never pretend that rendering is free.
- Default owner plan: draft/storyboard first; low-resolution/short test only after a cost estimate and approval.
- Customer plans must have generation limits, duration/resolution limits, transparent credits, and per-project cost visibility. Never subsidize unlimited expensive generations.
- No customer is charged until a plan, price, payment method, taxes/refunds, and terms are explicitly configured and approved by the owner.

## Architecture boundaries
- Provider-neutral adapter interface; provider API keys only on the server, never in browser code or APK.
- Asynchronous generation jobs with queued/running/succeeded/failed/cancelled states.
- Durable database records for projects, source assets, rights, prompts, storyboards, provider jobs, outputs, cost ledger, approvals, exports, and audit events.
- Object storage for audio/video; signed, expiring URLs for private assets.
- Retry only safe transient failures; idempotency keys; record provider refunds/charges.
- Owner-level budget cap and global pause switch.
- Per-customer workspace isolation and authorization checks.
- Keep AI Buddy product marketing and music marketing separate.

## Delivery phases
A. Product contract, typed domain model, and mock preview workflow.
B. Authenticated project/asset persistence, rights and approval records.
C. Provider adapter and async worker, after provider and budget are selected.
D. Preview/revision UI and export.
E. Official social integrations and analytics, subject to platform OAuth/API approval.
F. QA, accessibility, security, real-device checks, and cost acceptance.

## Acceptance criteria
- A storyboard can be created without spending money.
- A paid generation cannot start without showing exact estimate and receiving owner approval.
- No secret appears in frontend or Android package.
- Preview, revisions, cost history, ownership/rights, and deletion work.
- Publishing cannot happen before explicit approval and a verified platform connection.
- Errors, retries, provider charges, and refunds are visible.
- Automated tests cover permissions, budget caps, state transitions, and workspace isolation.
