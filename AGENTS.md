<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- AI calls go through the server route src/routes/api/chat.ts (Lovable AI Gateway, Gemini model) with per-IP rate limiting; never call the AI from the browser so keys stay server-side.
- Voice uses the free browser Web Speech APIs (recognition + speechSynthesis) to avoid paid TTS/STT usage.
- Recorder resources are owned by VoiceRecorder and released on unmount/pagehide, including permission requests that resolve after leaving; this prevents background microphone capture.
- Chat uses shrinkable text columns and a nonshrinking composer with keyboard-resizing viewport metadata so narrow phone screens retain their controls.
- Chat recognition and song speech playback use a shared page-media lifecycle guard so leaving a page cancels speech and invalidates late microphone permission results.
- AI routes validate browser input using shared Zod schemas before calling Gemini so malformed input cannot inject system roles or cause type errors.
