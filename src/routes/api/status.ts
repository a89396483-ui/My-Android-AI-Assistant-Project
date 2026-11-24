import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async () => {
        const geminiConfigured = Boolean(process.env["GEMINI_API_KEY"]);
        const lovableConfigured = Boolean(process.env["LOVABLE_API_KEY"]);
        const features = [
          { id: "chat", name: "AI Buddy chat", status: "implemented", detail: "Multilingual chat interface is in the project." },
          { id: "voice", name: "Voice input and spoken replies", status: "implemented-needs-phone-test", detail: "Voice code is present; microphone, recognition and speech playback need testing on the real phone." },
          { id: "free", name: "Basic free helper", status: "implemented", detail: "Some common help replies work without an external AI key." },
          { id: "gemini", name: "Full Gemini AI", status: geminiConfigured ? "key-present-needs-live-test" : "needs-owner-key", detail: geminiConfigured ? "A key is present; a successful live request still needs testing." : "Add GEMINI_API_KEY privately in Vercel settings, redeploy and test." },
          { id: "records", name: "Accounts, stock and orders", status: "implemented-local-only", detail: "Records stay in this browser on this device; they are not cloud-synced." },
          { id: "backup", name: "Backup and restore", status: "implemented", detail: "Manual JSON backup and restore are available." },
          { id: "growth", name: "Customer growth tracker", status: "implemented-manual", detail: "Lead notes and follow-ups are local; automatic discovery and messaging are not connected." },
          { id: "marketing", name: "Marketing drafts", status: "implemented-drafts-only", detail: "Drafts can be prepared; live publishing and paid ads are not connected." },
          { id: "message-center", name: "Multi-AI message center", status: "not-built", detail: "A connected multi-provider message center is not built yet." },
          { id: "agent", name: "Self-running AI agent", status: "not-built", detail: "No background task runner is active." },
          { id: "customers", name: "Customer login and free trial", status: "not-built", detail: "Registration, trial limits and owner/customer access separation remain to be built." },
          { id: "payments", name: "Packages and payments", status: "needs-provider-and-build", detail: "Payment provider, package prices and trial duration must be chosen before implementation." },
          { id: "social", name: "Automatic social posting and inbox", status: "needs-official-account-connection", detail: "Requires official platform setup, permissions and owner approval." },
          { id: "audio", name: "Full song audio generation", status: "not-connected", detail: "Song tools currently prepare lyrics; full audio needs a compatible provider." },
          { id: "cloud", name: "Cloud data sync", status: "not-built", detail: "Business records currently stay in local browser storage." },
          { id: "apk", name: "Android APK and phone install", status: "not-tested", detail: "A final APK build and installation test are still required." },
        ];
        return Response.json({
          app: "AI Buddy", checkedAt: new Date().toISOString(),
          chatProvider: geminiConfigured ? "gemini" : lovableConfigured ? "lovable-gateway" : "not-configured",
          openEndedChatReady: geminiConfigured || lovableConfigured, freeHelper: "available",
          songAudioGeneration: "not-connected", socialAutoPublishing: "not-connected",
          customerPayments: "not-configured", customerAccounts: "not-configured", features,
          note: "This is a code and environment checklist, not proof that external providers work. Phone/live tests are still required where stated. Never paste API keys into chat.",
        }, { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
