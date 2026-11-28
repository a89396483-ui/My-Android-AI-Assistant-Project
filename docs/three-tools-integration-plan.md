# AI-Buddy: Three Core Tools — Integration Plan

This plan applies to the existing AI-Buddy project. Preserve all existing features and work only on the `ai-business-manager-foundation` branch until the owner explicitly approves production changes.

## 1. Shop AI (accounts, stock and udhaar)
- Accept short natural-language or voice-transcribed commands for sales, expenses, purchases, stock changes and customer credit.
- Ask one clarification when required.
- Show a transaction preview and require owner confirmation before saving.
- Calculate totals and balances from stored transaction records with deterministic code, never from model guesses.
- Move data from browser-only localStorage to authenticated persistent storage before promising cross-device access.
- Do not overwrite or delete existing records during migration.

## 2. WhatsApp Customer AI
- Connect through the official WhatsApp Business Platform / Cloud API.
- Receive inbound messages through a verified webhook.
- Draft answers using only the business profile, current stock/prices and approved policies.
- Send only after the customer has initiated a conversation or otherwise provided valid opt-in, and only within WhatsApp's applicable messaging window/template rules.
- Owner approval is required before enabling outbound automation. Log delivery status and errors; never claim delivery until provider confirms it.
- Keep access tokens server-side. Never collect or store a WhatsApp OTP or personal account password.

Required provider setup (server-side secrets/configuration):
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_ACCOUNT_ID` (where needed)
- `WHATSAPP_VERIFY_TOKEN` (owner-generated webhook verification secret)
- `WHATSAPP_APP_SECRET` (for webhook signature validation)
- Public HTTPS webhook URL and Meta app configuration.

## 3. Marketing & customer discovery AI
- Use a real search/data provider to discover public business prospects; record source URL, discovery date and reason for fit.
- Never fabricate names, phone numbers, emails or search results. Respect site terms, privacy rules and opt-out requests.
- Generate localized posts, captions, creatives/scripts and campaign suggestions from verified business details.
- Publish only through authorized official platform APIs after owner enables publishing and approves the content.
- Paid ads require a separate explicit budget approval. Never spend or boost automatically.
- Show the source and status for every prospect and post.

Required Meta setup (server-side secrets/configuration, depending on enabled features):
- `META_APP_ID`
- `META_APP_SECRET`
- `META_ACCESS_TOKEN` (long-lived token with only the necessary permissions)
- `META_PAGE_ID`
- Instagram professional account linked to the Facebook Page for Instagram publishing.
- Approved Meta app permissions and business/account authorization.
- A separate search provider/API configuration for prospect discovery; Meta publishing credentials do not provide general-purpose web lead discovery.

## Safety and release gates
- No outbound WhatsApp messages, public posts, paid ads, or external account changes during development.
- No credentials in browser code, Git, logs, screenshots, or chat messages.
- Use test accounts and test recipients first.
- Validate webhook signatures, authorization, rate limits, consent/opt-out status, duplicate-event handling and audit logs.
- Run automated tests and end-to-end tests against a preview deployment.
- Do not merge to main or deploy to production without explicit owner approval.

## Current implementation status (based on code review)
- Shop records currently use browser localStorage; no confirmed shared server database.
- Customer reply currently produces a draft via `/api/chat`; no WhatsApp send integration is present.
- Marketing currently generates a plan/draft; no confirmed live prospect search or Meta publishing integration is present.
- The existence of an API route does not prove Gemini is configured. Verify provider credentials and a real response in preview before calling AI operational.
