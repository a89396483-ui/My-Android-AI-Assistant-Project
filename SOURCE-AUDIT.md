# AI-Buddy current-source audit — November 7, 2026

This is the existing editable project, not a replacement, APK, or newly built app.
The historical V4.2 label is user-provided; package.json does not establish a version number.
No missing referenced local imports or assets were identified in the inspected source.
10 existing tests passed; / and /song opened with HTTP 200 and no page errors.
No AI generation was purchased or invoked during this audit. This is not a fresh real-device or full-AI-flow certification.

## Missing handoff information supplied here
- .env.example: complete blank setting template, added to this export only.
- SOURCE-AUDIT.md: these handoff notes, added to this export only.

## Existing files with incomplete requested functionality
- src/routes/api/song.ts: lyrics only; no singing, instruments, or generated song audio.
- src/routes/song.tsx: lyrics copy/download and spoken playback; no generated full-song audio player/download.
- src/routes/api/chat.ts and src/routes/api/song.ts: in-memory per-instance limits, not deployment-wide limits.
- public/manifest.webmanifest and src/routes/__root.tsx: manifest/icons exist; no service worker or offline implementation.
- README.md: generic setup instructions; use the setting template and these notes when handing off.

## Absent implementations, not recoverable missing original files
No Android project, AndroidManifest.xml, Gradle files, MainActivity.java, ScreenCaptureService.java,
FloatingWidgetService.java, or Capacitor configuration exists in this checkout.
Do not invent those files or substitute a sample Android app and label it original.
App.tsx is not required: this app uses TanStack Start file routes.
package-lock.json is absent because bun.lock is the actual dependency lockfile.
drizzle/schema.ts is intentionally blank; generated database types declare no public application tables.
Cloud connection modules exist, but cloud chat/song persistence is not implemented in this source.
The previously mentioned original 20 files were not available for comparison.

## Run and continue development
Use package.json together with bun.lock. Install Bun and run `bun install`, then `bun run dev`.
Use `bun run test` for existing tests. Use the existing TanStack/Vite configuration; do not replace the routing framework.
Copy .env.example to .env only in your own local environment and fill appropriate settings.
LOVABLE_API_KEY is required by the current server-side AI routes. Existing hosted credentials and gateway access are
not transferable in this source export; an external developer must arrange authorized AI access.
Cloud URL/publishable settings belong to the backend the developer is authorized to use.
Never put private keys into browser code. Do not try to retrieve a managed Cloud service key.
Android notes are in ANDROID-PREPARATION.md; they describe preparation, not a built APK.
Real Android Urdu speech recognition, installed female voices, and camera still need device testing.

## Export boundaries
All editable source, UI components, routes, assets, tests, bun.lock and configuration are included.
.git, editor/platform-private metadata, installed node_modules, generated build output, local .env, and secrets are excluded.
The exported supabase/config.toml has its project identifier blanked intentionally; the live file was not changed.
.env.example and this audit note are export-only additions. All other source files are copied unchanged.
The text bundle contains full UTF-8 file contents in path order; binary images remain in the ZIP.
Dependencies are reproducible from package.json and bun.lock; node_modules is intentionally not bundled.
