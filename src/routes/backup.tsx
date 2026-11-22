import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent } from "react";
import { ArrowLeft, Download, FileUp, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/backup")({ component: BackupPage });

const BACKUP_KEYS = [
  "ai-buddy-business-profile",
  "ai-buddy-business-leads",
  "ai-buddy-company-growth-leads",
  "ai-buddy-business-accounts",
  "ai-buddy-business-whatsapp",
  "ai-buddy-business-campaign-drafts",
  "ai-buddy-accounts-v2",
  "ai-buddy-stock-v1",
  "ai-buddy-orders-v1",
] as const;

type BackupFile = {
  app: "AI Buddy";
  version: 1;
  exportedAt: string;
  data: Partial<Record<(typeof BACKUP_KEYS)[number], unknown>>;
};

function BackupPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function exportBackup() {
    try {
      const data: BackupFile["data"] = {};
      for (const key of BACKUP_KEYS) {
        const value = localStorage.getItem(key);
        if (value !== null) data[key] = JSON.parse(value);
      }
      const backup: BackupFile = { app: "AI Buddy", version: 1, exportedAt: new Date().toISOString(), data };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-buddy-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("Backup file downloaded. Keep it somewhere safe.");
    } catch {
      setMessage("Backup could not be created. Check phone storage and try again.");
    }
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      const parsed = JSON.parse(await file.text()) as Partial<BackupFile>;
      if (parsed.app !== "AI Buddy" || parsed.version !== 1 || !parsed.data || typeof parsed.data !== "object" || Array.isArray(parsed.data)) {
        throw new Error("Invalid backup");
      }
      const entries = Object.entries(parsed.data);
      if (entries.some(([key, value]) => !BACKUP_KEYS.includes(key as (typeof BACKUP_KEYS)[number]) || value === undefined)) {
        throw new Error("Unsupported backup contents");
      }
      if (!window.confirm("Restore this backup on this phone? Existing saved records in these sections will be replaced.")) return;
      const previous = new Map<string, string | null>();
      try {
        for (const [key, value] of entries) {
          previous.set(key, localStorage.getItem(key));
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        for (const [key, value] of previous) {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        }
        throw error;
      }
      setMessage(`Backup restored: ${entries.length} data sections. Refresh each tool to see the restored records.`);
    } catch {
      setMessage("This file is not a valid AI Buddy backup, or the phone could not save it.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <main className="min-h-dvh bg-glow px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Dashboard</Link>
        <header className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10"><ShieldCheck className="size-6" /></span>
          <div><h1 className="text-2xl font-bold">Backup & Restore</h1><p className="text-sm text-muted-foreground">Keep your business records safe when changing phones.</p></div>
        </header>
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4">
          <div><h2 className="font-semibold">Download your backup</h2><p className="mt-1 text-sm text-muted-foreground">Save business profile, customer leads, AI Buddy growth leads, accounts, stock, campaign drafts and orders into one file.</p></div>
          <button onClick={exportBackup} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-3 font-semibold text-primary-foreground"><Download className="size-4" /> Download backup file</button>
          <div className="border-t border-border pt-4"><h2 className="font-semibold">Restore a backup</h2><p className="mt-1 text-sm text-muted-foreground">Choose an AI Buddy backup file. Existing records in the included sections will be replaced after confirmation.</p></div>
          <input ref={inputRef} type="file" accept="application/json,.json" onChange={importBackup} className="hidden" />
          <button disabled={busy} onClick={() => inputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary p-3 font-semibold disabled:opacity-50"><FileUp className="size-4" /> {busy ? "Restoring…" : "Choose backup file"}</button>
          {message && <p role="status" className="rounded-xl bg-secondary p-3 text-sm">{message}</p>}
        </section>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">Your data currently stays in this browser on this phone. This backup is a file you control; it is not cloud sync. Keep the file private because it may contain customer names, phone numbers and business records. Restore only a file you trust.</p>
      </div>
    </main>
  );
}
