import { useEffect, useRef, useState } from "react";
import { Mic, Square, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Records the user's own singing on the phone only. Nothing is uploaded.
export function VoiceRecorder() {
  const [rec, setRec] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const mr = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlRef = useRef<string | null>(null);
  const mounted = useRef(false);
  const pending = useRef(false);
  const generation = useRef(0);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    mounted.current = true;
    const release = () => {
      generation.current += 1;
      const recorder = mr.current;
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        if (recorder.state !== "inactive") recorder.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      mr.current = null;
      streamRef.current = null;
      pending.current = false;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    };
    const leave = () => {
      release();
      setRec(false);
      setStarting(false);
      setUrl(null);
    };
    window.addEventListener("pagehide", leave);
    return () => {
      mounted.current = false;
      window.removeEventListener("pagehide", leave);
      release();
    };
  }, []);

  async function start() {
    if (pending.current || mr.current?.state === "recording") return;
    pending.current = true;
    setStarting(true);
    const currentGeneration = generation.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      if (!mounted.current || currentGeneration !== generation.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const chunks: Blob[] = [];
      const m = new MediaRecorder(stream);
      m.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      m.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mr.current = null;
        if (!mounted.current || currentGeneration !== generation.current) return;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = URL.createObjectURL(new Blob(chunks, { type: m.mimeType }));
        setUrl(urlRef.current);
        setRec(false);
      };
      m.start(); mr.current = m; setRec(true);
    } catch {
      if (currentGeneration === generation.current) {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (mounted.current) toast.error("Recording could not start. In Chrome, tap the site controls beside the address → Permissions → Microphone → Allow.");
      }
    } finally {
      if (mounted.current && currentGeneration === generation.current) {
        pending.current = false;
        setStarting(false);
      }
    }
  }
  function stop() {
    if (mr.current && mr.current.state !== "inactive") mr.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRec(false);
  }

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <h2 className="font-semibold">🎤 Record your own voice</h2>
      <p className="text-sm text-muted-foreground">Sing your song. Noise reduction is on. The recording stays on your phone.</p>
      <Button onClick={rec ? stop : start} disabled={starting} variant={rec ? "destructive" : "default"} className="h-auto w-full whitespace-normal rounded-xl py-3 font-semibold">
        {rec ? <><Square className="size-5" /> Stop recording</> : <><Mic className="size-5" /> {starting ? "Opening microphone…" : "Start recording"}</>}
      </Button>
      {url && <>
        <audio controls src={url} className="w-full" />
        <a href={url} download="my-song-recording.webm" className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 font-semibold"><Download className="size-5" /> Download recording</a>
      </>}
    </section>
  );
}
