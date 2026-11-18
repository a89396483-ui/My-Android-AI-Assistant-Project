# AI Buddy

AI Buddy is the existing TanStack Start / React application. This repository preserves the current web app; it is not a replacement project or a completed Android APK.

## Main screens
- `/` — AI Buddy chat, language selection, image attachment and browser voice features.
- `/song` — original song-lyrics drafting.
- `/business-manager` — business planning, customer notes, campaign drafts and account summaries.
- `/manager-ai` — AI Business Manager chat.
- `/api/chat` — server-side AI chat endpoint.
- `/api/song` — lyrics-generation endpoint.

## Development
Requirements: Node.js 22 or a compatible Bun installation.

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
```

The repository currently has no committed npm lockfile. CI installs from `package.json`; dependency versions are not fully locked. Do not use `npm ci` until a lockfile is intentionally added and reviewed.

## AI configuration
The existing server-side chat and lyrics endpoints require `LOVABLE_API_KEY`. Copy `.env.example` to a local `.env` and configure the key only in an authorized development/hosting environment. Never commit secrets or place private keys in browser code. No key is included in this repository.

The app currently uses the Lovable AI Gateway with a Gemini model. Test live AI calls only after confirming authorized access and any usage charges/free limits.

## Important feature limits
- Chat and memories are stored in browser local storage on that device; cross-device cloud sync is not implemented.
- Voice input/output uses browser capabilities and is not guaranteed to work in every Android WebView.
- The song tool writes lyrics; it does not generate a complete sung audio file.
- Business and social marketing tools prepare drafts and local notes. Social accounts, customer inboxes, automated publishing, live prospect search and payment processing are not connected.
- Music-video helpers prepare storyboards/prompts only; no video-generation provider is wired.
- The Capacitor configuration is preliminary. No native Android project, signed APK or Play Store release is included.

## Status and release gates
See [the verified engineering status](docs/AI-BUDDY-STATUS-2026-11-19.md), [Android release gates](docs/ANDROID-RELEASE-GATES.md), and [the source audit](SOURCE-AUDIT.md).

All work stays on `ai-business-manager-foundation` until checks pass and the owner approves a merge. Do not deploy, publish, spend money or release an APK without explicit approval.
