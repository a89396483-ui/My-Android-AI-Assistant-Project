# Marketing Data Model & API Contract

Status: implementation contract; migrations and routes are not yet built or tested.

## Core records
- Workspaces: owner, brand type (AI Buddy, music promotion, artist, client), name, status.
- Social accounts: workspace, platform, external ID, scopes, encrypted token reference, expiry, connection status.
- Campaigns: workspace, objective, dates, status, budget, currency, approved cap.
- Assets: workspace, campaign, kind, storage key, checksum, rights status and metadata.
- Content drafts: campaign, platform, caption, asset references, status, authoring agent.
- Approvals: action, exact payload hash, requester, approver, timestamp, expiry.
- Publish jobs and receipts: schedule, account, idempotency key, attempts, platform post ID, URL, timestamp.
- Analytics snapshots: campaign, platform, capture time, available metrics.
- Agent tasks: role, workspace, objective, permissions, acceptance criteria, status and result.
- Audit events: actor, workspace, action, target, timestamp, details.
- Automation settings: global pause, allowed accounts/content, policy.

## Route concepts
- GET/POST /api/marketing/workspaces
- GET/POST /api/marketing/campaigns
- POST /api/marketing/assets
- POST /api/marketing/drafts
- POST /api/marketing/approvals
- POST /api/marketing/publish-jobs
- POST /api/marketing/publish-jobs/:id/cancel
- GET /api/marketing/analytics
- POST /api/marketing/pause and /resume
- OAuth routes under /api/integrations/:platform

## Invariants
Every request is owner/workspace scoped and authorized server-side. Never expose tokens to clients. Publishing checks rights, approval policy, connected account, pause flag, and idempotency. Paid execution checks fresh approval and server-side budget cap. Audit every connection, approval, publish attempt, spend action, pause, and resume. Use durable database queue; in-memory timers are insufficient for multi-instance deployment.

## Secrets
Server-side secret manager only. Example environment files may list empty variable names, never real credentials. Never commit tokens or API keys.