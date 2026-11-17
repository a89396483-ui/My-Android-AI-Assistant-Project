# Owner and Customer Cost Policy

Status: policy proposal; prices and billing are not configured.

## Core rule
No paid provider, subscription, credit purchase, paid ad, or customer charge may be activated without Ashraf's explicit approval. Show provider, feature, estimated quantity, currency, estimate expiry, and maximum amount before any billable action.

## Owner workspace
- Prefer free planning, storyboards, captions, templates, local preview and manual export where feasible.
- Separate AI text-model costs from image/video generation, storage, hosting and social API costs.
- Never describe a provider's free trial as permanently free.
- Keep an owner-set monthly cap and per-job cap; stop when either cap is reached.
- Do not silently switch providers or models when a quota is exhausted.
- Show actual provider receipts and reconcile estimate versus actual charge.
- Music creation, music video generation, music promotion, and AI Buddy business marketing have separate ledgers.

## Customer proposal (not yet live)
1. Free: limited text planning, captions, storyboard drafts and manual export templates. No promise of unlimited generated video.
2. Creator: prepaid credits for selected video lengths/resolutions and limited revisions.
3. Studio: larger prepaid allowance, multiple projects, brand presets and exportable campaign reports.
4. Agency: separately negotiated client workspaces, seats, permissions and audit exports.

## Billing safeguards
- No customer billing until legal entity, supported payment provider, currency, taxes, refunds, terms, privacy notice and support process are approved.
- Display credits and expected output before purchase.
- Do not sell credits that cannot be fulfilled by the configured provider.
- Record provider job ID, estimate, approval, actual charge, refund, output and deletion request.
- Refund/credit policy must cover provider failure and partial generation.
- Customer data and assets are isolated per workspace.
- Do not use customer assets to train or promote another customer's campaign without explicit permission.

## Unit economics
For every feature calculate:
provider generation cost + storage/egress + hosting/queue + payment fees + support allowance = estimated fulfilment cost.
Set customer price only after measured tests and a margin decision by the owner. Do not invent a PKR price before these inputs are known.

## Launch gates
- Verified provider pricing and API terms
- Working cost estimator and owner/customer caps
- Payment sandbox and refund tests
- Access-control and tenant-isolation tests
- Clear terms, privacy, rights and deletion workflows
- Owner approval of price sheet and customer plan limits
