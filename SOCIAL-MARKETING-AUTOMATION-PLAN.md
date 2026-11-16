# AI Buddy Social Marketing Automation

## Primary goal
Consistently attract genuine customers for AI Buddy's real services. Marketing is a core product capability, not an optional extra.

## Owner-owned accounts
All publishing must happen through accounts the owner connects and authorizes. AI Buddy must never create or use fake identities, borrow someone else's account, or ask for account passwords in chat.

### Account connection model
- Google / YouTube: Google OAuth 2.0 with the minimum YouTube upload and channel-management scopes needed.
- Facebook Pages and Instagram Professional accounts: Meta OAuth and the permissions approved for the owner's Page / professional Instagram account.
- X: official X developer app and user authorization; API usage may be charged per request.
- Other networks: add only when an official supported publishing API or approved publishing provider is available.

Gmail is the owner's email identity and may be used for notices or account-related communication, but Gmail connection by itself does not grant permission to publish to Facebook, Instagram, X, or YouTube. YouTube publishing needs Google authorization; Meta platforms need Meta authorization; X needs X authorization.

## Publishing rhythm
Default plan: prepare a content calendar and publish one approved item every 3–4 days (roughly two posts per week). The owner can change the cadence. AI Buddy should vary formats and avoid repetitive posts.

## Weekly workflow
1. Review AI Buddy's actual available services and current product status.
2. Identify customer problems the product can genuinely solve.
3. Create a weekly content plan with platform-specific copy, image/video brief, call to action, and language.
4. Generate drafts for Facebook, Instagram, X, YouTube Shorts, and WhatsApp Status where suitable.
5. Check claims, links, spelling, rights to media, and platform-specific limits.
6. Queue the approved content with a scheduled date/time.
7. Publish through the authorized official API.
8. Verify the platform returns a post/video ID and save the URL, platform, timestamp, and status.
9. Report failures and retry safely without duplicate posts.
10. Review available reach, engagement, inquiries, and leads; use results to improve the next plan.

## Approval and safety
- Initial default: owner approval is required before every public post and before paid promotion.
- After the owner explicitly enables a platform-specific auto-publish mode, posts matching the approved campaign rules may publish automatically within the approved schedule and budget.
- Never launch paid ads, spend money, send bulk DMs, scrape private data, or contact prospects automatically without separate explicit permission.
- Provide pause-all and disconnect controls.
- Keep an audit log of drafts, approvals, publishing attempts, post IDs, errors, and spend.
- Never promise services or features that are not live and tested.

## Suggested initial customer groups
- Job seekers and students who need CVs, applications, forms, or document formatting.
- Shopkeepers and small businesses that need marketing copy, product descriptions, and customer replies.
- Home businesses and local service providers that need simple promotional content.
- Creators and freelancers who need captions, scripts, and content planning.

Use public business contact channels and respectful opt-in outreach. Do not scrape private contact information or send unsolicited bulk messages.

## Technical components required
- OAuth connection and token refresh for each platform.
- Encrypted server-side credential storage; no tokens in browser code or public GitHub.
- Persistent database tables for connected accounts, campaign briefs, content drafts, approvals, scheduled jobs, publication results, and analytics snapshots.
- Durable scheduler/queue with idempotency keys, retry limits, and duplicate-post protection.
- Platform adapters that implement official API requirements independently.
- Owner dashboard showing connected account, permissions, next scheduled post, queue, results, and pause controls.
- Notifications to the owner's chosen contact channel when approval, reconnection, or error is needed.

## Current status and blockers
The current Business Manager branch contains platform-specific draft templates and a manual prospecting guide only. It does not yet connect social accounts, schedule jobs, publish posts, search live leads, or read campaign analytics.

Publishing is platform-specific and requires separate authorization. Meta's Page publishing requires Page access and permissions such as pages_manage_posts; Instagram publishing is for eligible professional accounts and requires Instagram permissions. YouTube uploads require Google OAuth and YouTube Data API authorization. X's current developer platform lists per-request pricing, including post creation. Confirm current eligibility, review requirements, quotas, and charges before implementation.

No account credentials, OAuth secrets, or API tokens should be committed to this repository.


## Viral growth and performance-learning agent
The goal is to improve the probability of discovery and sharing, never to guarantee virality or promise a fixed view count.

For each campaign, the agent should:
1. Research current audience questions, relevant public trends, and competitor content patterns without copying other creators.
2. Build several original creative angles and hooks; test different openings, story structures, lengths, demonstrations, and calls to action.
3. Make videos useful, entertaining, clear, accessible, and specific to one audience problem. Show real product demonstrations where available; label mockups and previews honestly.
4. Adapt each edit, caption, title, thumbnail/cover, keywords, and permitted audio to the destination platform. Respect music, image, and creator rights.
5. Publish only through authorized platform connections and within the owner's cadence and approval settings.
6. Collect platform-provided analytics where available: reach, views, average watch duration, completion/retention, shares, saves, comments, profile visits, link clicks, inquiries, and qualified leads.
7. Compare each post with the account's own historical baseline, identify what worked, and propose the next experiments. Do not optimize for likes alone.
8. Maintain a content experiment log so learning carries across weeks and platforms.

Avoid fake engagement, purchased views/followers, engagement pods, spam comments, misleading claims, copied videos, unauthorized automation, and mass unsolicited DMs. Do not exploit tragedies or make false guarantees.

## Future paid customer marketing service
After AI Buddy's own marketing workflow is validated, the owner may offer marketing services to customers for payment. This must be a separate client-workspace capability, not a shared mixed account.

Each client workspace must have:
- Its own business profile, brand voice, audience, content calendar, connected social accounts, approvals, analytics, and billing record.
- Client-owned OAuth authorization; never publish to a client's account using the owner's credentials.
- A clear service package, deliverables, posting cadence, revision limits, price, payment status, and service agreement.
- Client approval before publishing by default; optional auto-publishing only after explicit written client authorization and within agreed rules.
- Separation of client files, leads, messages, analytics, tokens, and billing from every other client.
- Owner review, audit logs, pause/disconnect controls, and a way for the client to revoke access.

The owner controls pricing and accepts customers. AI Buddy can prepare proposals, content calendars, drafts, reports, and customer replies; it must not promise results or spend client advertising budgets without separate authorization.

## Measurement and learning
Use platform-native analytics and attributable inquiries where available. Track qualified leads and customer conversions in addition to views. Report uncertainty and missing metrics rather than inventing numbers. Virality is an outcome to learn from, not a controllable guarantee.
