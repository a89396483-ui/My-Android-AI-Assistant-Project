import type { CapacitorConfig } from "@capacitor/cli";

/**
 * AI-Buddy Android wrapper configuration.
 *
 * This shell loads the existing hosted website; it does not bundle server
 * secrets or replace the TanStack Start backend.
 *
 * Before the first Android build, confirm the app ID and display name with
 * the owner and install matching @capacitor/* packages.
 */
const config: CapacitorConfig = {
  appId: "com.ashraf.aibuddy",
  appName: "AI Buddy",
  webDir: "dist",
  server: {
    url: "https://friend-online.lovable.app",
    cleartext: false,
    allowNavigation: ["friend-online.lovable.app"],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
