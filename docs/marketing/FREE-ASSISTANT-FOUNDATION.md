# Free Assistant Foundation

Status: first local helper implementation; website UI and live deployment still require separate work.

## What works without a model provider
- Fixed multilingual greetings.
- FAQ replies about planned features and current package/payment status.
- Instructions for sharing the website link manually.
- A fixed, truthful AI Buddy promotional draft.
- Unknown/open-ended requests are not faked as generative AI.

## What does not work yet
- General-purpose writing, reasoning, research, image understanding or dynamic customer-specific answers.
- Automatic WhatsApp, email or social posting.
- Customer accounts, trial quotas, payment collection or feature unlocks.
- Persistent server-side customer analytics.

## Safety and cost
- No paid API key or external provider is needed for the local FAQ/template responses.
- The real model route remains separate and requires a server-side provider key and may incur usage charges.
- Never place provider secrets in browser code or local storage.
- Do not automatically contact people, publish posts, buy ads or spend money.
- Prices remain unconfigured until the owner approves a tested price sheet.

## Test
Run `npm test`. The free helper tests are in `src/lib/free-assistant.test.ts`.
