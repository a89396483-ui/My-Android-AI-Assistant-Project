# AI Business Manager — Foundation Plan

Status: planning document only. This is not a claim that the agents or automations are already implemented.

## Product direction

Add an AI Business Manager inside the existing AI Buddy project. Preserve the existing AI Assistant, Song Creator, Gaming Help, routes, styling system, and current behavior. Do not replace the app or create a separate app.

The experience should feel like one capable manager to the owner and to customers. Internally, use one main orchestrator that routes work to focused specialist agents. Specialists may share the same approved model/provider initially; separate expensive models are not required for every role.

## Main navigation

1. Main AI Manager — the single chat/voice entry point and task coordinator.
2. Marketing Agent — drafts campaigns, captions, offers, and schedules.
3. Customer Finder — researches permitted public business prospects and organizes leads.
4. Customer Conversation Agent — answers approved FAQs and qualifies enquiries.
5. Owner Handoff — sends the owner a lead summary and requests a call/WhatsApp handoff.
6. Accounts — records owner-entered or integrated income, expenses, invoices, and profit.
7. Business Workspace — business profile, services, prices, opening hours, FAQs, and order status.
8. Business Teacher — explains business setup and growth in simple language.
9. Leads & Orders — searchable customer, lead, and order lists.
10. Settings & Permissions — owner contact, languages, connected channels, budgets, approval rules, and data controls.

## Main manager behavior

- Accept natural-language requests such as "open marketing", "find customers", "show today's enquiries", and "prepare a promotion".
- Select the relevant specialist, pass only the context needed for that task, and return the result in the main conversation.
- Explain clearly when a specialist is unavailable or a required integration is not connected.
- Offer customers a truthful, concise capability list based on enabled services, not aspirational features.

## Customer-facing capability response

The manager should describe only services that are configured and currently available for this business. Example categories:
- Marketing content and campaign preparation
- Business information and service FAQs
- Enquiry handling and lead qualification
- Appointment/order enquiry capture
- Owner handoff
- Basic business records and reports, when configured

Never claim that it can publish ads, contact prospects, accept payments, or access external accounts until the relevant integration is connected and tested.

## Owner handoff and privacy

- Owner configures and verifies the contact number in Settings.
- Default behavior: notify the owner with the customer's name (if provided), contact details (only if the customer consents), question, and conversation summary.
- Do not reveal the owner's private number automatically.
- Share the owner's number with a customer only when the owner explicitly enables that rule and approves the relevant handoff, or has configured a clear business contact number for public sharing.
- Provide a clear human handoff option and never pretend a human has joined.

## Safety, approval, and spending controls

- Draft first; require owner approval before publishing posts, sending outbound messages, launching campaigns, changing prices, issuing refunds, or spending money.
- Enforce owner-defined daily/monthly budgets and channel permissions.
- Do not scrape private data, bypass platform rules, spam people, or message prospects without a lawful/consented basis.
- Keep an audit log of actions, approvals, failures, and costs.
- Make connected services and their permissions visible and revocable.

## Technical architecture

- Keep the existing TanStack Start + React + TypeScript architecture.
- Add a typed manager-intent/router layer on the server; validate all inputs with schemas.
- Define specialist interfaces with narrow tools and explicit permissions.
- Keep provider credentials server-side only; never expose secrets in browser code or commit them.
- Use persistent shared storage for business settings, leads, approvals, conversations, and audit records before enabling multi-instance automation.
- Add rate limits and idempotency for actions that can send messages or spend money.
- Start with simulated/draft-only specialist flows; connect external channels only after the owner chooses and authorizes them.

## Delivery phases

### Phase 0 — design and preservation
- Review the owner's reference screenshot and match its visual direction.
- Confirm menu labels, mobile layout, and business profile fields.
- Preserve existing app routes and features.

### Phase 1 — visible foundation
- Add the Business Manager dashboard/menu and responsive mobile cards.
- Add the main manager conversation shell and specialist status panels.
- Add a capability list generated from enabled features.
- No external messages, publishing, or spending.

### Phase 2 — owner configuration and records
- Business profile, service catalogue, FAQs, owner handoff preferences.
- Leads/orders lists and basic manual accounts.
- Approval queue and audit log.

### Phase 3 — specialist agents
- Main intent router and specialist prompts/tools.
- Marketing drafts, lead research workflow, customer FAQ/reply drafts, business coaching.
- Human handoff and owner notifications.

### Phase 4 — approved integrations
- Connect selected channels (for example, WhatsApp Business or social platforms) only after checking current API availability, cost, and permissions.
- Add scheduled publishing and customer messaging with explicit approval and budget controls.
- Test end-to-end with the owner before enabling live actions.

## Acceptance criteria

- Existing AI Buddy features still work.
- Mobile dashboard is readable and easy to use.
- One main manager can route requests to the correct specialist.
- The customer capability list never promises disabled or unconnected features.
- Owner handoff works without exposing private contact details by default.
- External actions are approval-gated, logged, and budget-limited.
- Tests cover routing, permissions, consent, approvals, failures, and mobile UI.
