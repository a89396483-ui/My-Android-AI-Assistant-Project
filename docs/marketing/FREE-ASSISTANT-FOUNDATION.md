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


## Direct Gemini chat connection

The chat route now supports a direct Google Gemini API key stored only as the server-side environment variable `GEMINI_API_KEY`. The optional `GEMINI_MODEL` defaults to `gemini-3.8-flash`. The server sends the key in the `x-goog-api-key` header; it is never returned to the browser.

- The local FAQ helper is checked first and does not call an AI provider.
- If a Gemini key is configured, open-ended chat and image questions use that Gemini connection.
- If Gemini is rate-limited or fails, the app does not silently switch to another provider.
- The older `LOVABLE_API_KEY` connection remains supported only when `GEMINI_API_KEY` is absent.
- No API key is included in the repository. The owner must add a key to the hosting provider's server-side secret settings.
- Google AI Studio availability, free quota, pricing, regional eligibility and terms can change. Do not promise unlimited free usage; verify the current terms before enabling customer access.
- The song route is separate: this Gemini chat connection does not generate sung audio and does not turn the lyrics-only song route into an audio generator.

Official setup reference: https://ai.google.dev/gemini-api/docs/quickstart
