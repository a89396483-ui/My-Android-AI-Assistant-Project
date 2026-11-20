import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async () => {
        const geminiConfigured = Boolean(process.env["GEMINI_API_KEY"]);
        const lovableConfigured = Boolean(process.env["LOVABLE_API_KEY"]);
        return Response.json({
          app: "AI Buddy",
          freeHelper: "available",
          chatProvider: geminiConfigured ? "gemini" : lovableConfigured ? "lovable-gateway" : "not-configured",
          openEndedChatReady: geminiConfigured || lovableConfigured,
          songAudioGeneration: "not-connected",
          socialAutoPublishing: "not-connected",
          customerPayments: "not-configured",
          customerAccounts: "not-configured",
          note: "This status reports server configuration only. It does not test provider billing, account permissions, or successful live generation.",
        }, {
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
