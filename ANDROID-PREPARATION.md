# AI-Buddy Android preparation

Status: web application only. No APK, Android native project, signing key, or Play Store release has been created.

## Existing capabilities to preserve
Gemini requests stay on the hosted server. Browser storage holds chat text and memories; screenshot data is not persisted. Free browser speech recognition and text-to-speech remain the current voice implementation. Android Chrome home-screen metadata and icons already exist.

## Recommended APK path
Use a separate Capacitor Android shell for the existing hosted web experience; do not replace TanStack Start with a static SPA or bundle server keys into an APK. The public URL stays https://friend-online.lovable.app/. Building an APK requires an Android SDK/JDK build environment and an owner-controlled signing key, neither currently prepared here.

Before implementation, verify Capacitor's HTTPS origin and navigation restrictions, camera/microphone permission handling, Android Back behavior, external links, keyboard resizing and safe areas. Android WebView does not reliably expose browser SpeechRecognition; a native speech-recognition bridge and Android text-to-speech bridge must be validated on a real phone. Do not claim Chrome voice behavior automatically works in an APK.

## Owner inputs and release gates
- Original 20 files/ZIP to compare features and provenance (not needed to continue improving current source).
- Confirm package identifier and final app name before creating the shell.
- Owner-controlled signing key; never upload signing passwords to chat or include them in source.
- Real-device testing: Urdu speech recognition, installed female Urdu voice, photo capture, microphone release, game screenshots, song playback, history and memory.
- Publishing the website still requires explicit owner approval. Play Store distribution may have registration costs; development tools can be free. No paid service is authorized.

## 30-day target ending November 18, 2026
1. Week 1: audit source, lifecycle safety and free-allowance checks.
2. Week 2: Android owner tests and fixes, compare original files if supplied.
3. Week 3: build and test an Android shell only when the build environment and owner decisions are available.
4. Week 4: regression checks, source backup and release review; publish only with permission.

This is a target and handoff, not an autonomous scheduled service. Work continues when the owner returns to this conversation. No guarantee of free AI singing: it is currently lyrics-only, read-aloud and own-voice recording.
