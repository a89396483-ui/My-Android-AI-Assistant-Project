# AI Buddy engineering status — 2026-11-19

This status records verified repository work only. It is not a release certificate.

## Branch and preservation
- Repository: `a89396483-ui/My-Android-AI-Assistant-Project`
- Working branch: `ai-business-manager-foundation`
- Default branch: `main`
- All work in this handoff remains on the working branch. No merge, production deployment, public release, or paid service was initiated.
- The restored homepage route `src/routes/index.tsx` exists on the working branch.
- The generated route tree contains normal TypeScript line breaks and registers the homepage, song, business manager, manager chat, and API routes.

## Changes made in this pass
1. Fixed 29 double-escaped newline sequences in `src/lib/business-manager.ts`. Marketing drafts, social captions, video scripts and campaign copy now use actual line breaks instead of printing literal backslash-n text.
2. Added a regression test in `src/lib/business-manager.test.ts` to check real line breaks in campaign and social post output.
3. Added `.github/workflows/ci.yml` to run dependency installation, unit tests, ESLint and production build on pushes to `main` / the working branch and pull requests into `main`.
4. Removed the npm cache setting from CI because this repository currently has no committed npm lockfile.

## Verification still outstanding
- The new GitHub Actions workflow has not yet produced a run in the checks made during this pass. Its execution and result are therefore unverified.
- Vitest, ESLint and the production build have not been run in a build environment during this pass.
- No live Gemini response was tested. The server routes require an authorized server-side `LOVABLE_API_KEY`; `.env.example` contains a blank placeholder.
- API request limits are in-memory per server instance, not deployment-wide.
- Chat history and memories in the restored home route are stored in browser local storage, not a cross-device cloud database.
- Business lead/profile and account records are not yet authenticated, persistent multi-user cloud data.
- Social media and inbox channels are not connected; marketing and sales output is draft-only. No autonomous posting, unsolicited bulk outreach, live prospect search, or customer inbox sync is implemented.
- Song generation creates lyrics only. It does not generate a sung audio track.
- Music-video planning helpers exist, but no real generation provider, durable queue, storage, or completed video output is wired.
- `capacitor.config.ts` is preliminary configuration only. Capacitor packages are not installed in `package.json`; there is no native Android project, Gradle build, Android manifest, signing key, or APK.
- The original 20 Android files previously mentioned by the owner have not been supplied for comparison.

## Next required work
1. Run CI and fix every failing test, lint or build error.
2. Confirm the authorized AI gateway configuration and test chat safely with owner-approved usage.
3. Add authenticated persistent storage and server-side authorization before storing business/customer records in the cloud.
4. Implement official OAuth/API integrations only for channels the owner chooses and authorizes. Add durable scheduling, approvals, audit log, opt-out and a global pause before any automated external action.
5. Integrate a music/video provider only after showing actual pricing and obtaining explicit per-job spending approval.
6. Add compatible Capacitor dependencies, generate the Android project, implement/validate native permissions and voice bridges, then build and test on the owner's actual phone.
7. Keep the feature branch separate until CI passes and the owner explicitly approves merge/deployment/release.

## Cost and owner-safety rules
- No paid API, subscription, hosting upgrade, advertising spend, or media-generation spend is authorized by this work.
- Keep private keys server-side and out of Git.
- Never claim a post, message, payment, APK, or deployment succeeded without a verifiable result.
- Do not merge, deploy production, publish, or sign a release without explicit owner approval.

## Follow-up source review — 2026-11-19
- Confirmed `src/routes/api/chat.ts` and `src/routes/api/song.ts` call the Lovable AI Gateway at `https://ai.gateway.lovable.dev/v1/chat/completions`, selecting `google/gemini-3.8-flash`.
- The required `LOVABLE_API_KEY` is a Lovable gateway/project key, not a direct Google Gemini API key. The source export does not prove whether the live hosting secret is configured or whether live calls succeed.
- Corrected the `.env.example` and README wording so the two kinds of keys are not confused.
- Corrected song endpoint IP detection to use the forwarded client IP when the Cloudflare header is absent.
- Fixed the `no-this-alias` lint issue in the voice-recorder test without changing the component behavior.
- Latest inspected CI run before these follow-up commits: unit tests passed; lint failed with 704 errors (703 Prettier formatting findings and one `no-this-alias` finding); production build was skipped. The `no-this-alias` finding is now fixed in source, but a new CI result has not yet been verified. The repository-wide Prettier backlog remains.
