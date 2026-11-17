# Android Release Gates

Status: preparation checklist only; this file does not create an APK.

## Known state
Repository has a web application and preliminary Capacitor configuration. A native Android project, verified APK, signing key, and device-tested release are not established by this document.

## Required work
1. Confirm app ID, display name, and production origin with owner.
2. Verify production build and SSR/static hosting strategy; do not assume dist is a valid offline bundle.
3. Add compatible Capacitor dependencies and lockfile using repository package manager.
4. Generate native Android platform using Capacitor CLI in a real build environment.
5. Implement/test microphone and camera permissions and native bridges where browser support is insufficient.
6. Verify Android back navigation, safe areas, keyboard resize, uploads, lifecycle, and network errors.
7. Build debug APK, install on target phone, test core workflows.
8. Configure release signing securely; never commit keystore or passwords.
9. Build signed release APK/AAB and record hash, version, and logs.
10. Owner approves release and distribution channel.

## Blocker policy
Do not fabricate native Android files or claim an APK exists until generated and verified. A successful web build is not an APK build.