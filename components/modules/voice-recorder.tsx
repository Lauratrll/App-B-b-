"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "stopped" | "denied" | "unsupported";

const MAX_DURATION_SECONDS = 90; // 1 min vocale + petite marge

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceRecorder({ filename }: { filename?: string }) {
  const [state, setState] = useState<RecorderState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeRef = useRef<string>("audio/webm");

  // Vérifier le support au montage
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices ||
      typeof window.MediaRecorder === "undefined"
    ) {
      setState("unsupported");
    }
  }, []);

  // Cleanup : stopper stream + URL.revokeObjectURL au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    // Si on a déjà un enregistrement, le libérer
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDuration(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Choisir un mime supporté
      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      const mime =
        candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
      mimeRef.current = mime || "audio/webm";

      const recorder = new MediaRecorder(
        stream,
        mime ? { mimeType: mime } : undefined,
      );
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeRef.current });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("stopped");
      };

      recorder.start();
      setState("recording");

      // Compteur de durée + arrêt auto au max
      intervalRef.current = setInterval(() => {
        setDuration((d) => {
          const next = d + 1;
          if (next >= MAX_DURATION_SECONDS) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      const e = err as Error;
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setState("denied");
        setError("Accès au micro refusé. Active-le dans les réglages du navigateur.");
      } else {
        setError(e.message || "Impossible de démarrer l'enregistrement.");
      }
    }
  }, [audioUrl, stopRecording]);

  const resetRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setState("idle");
  }, [audioUrl]);

  const downloadRecording = useCallback(() => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    const ext = mimeRef.current.includes("mp4")
      ? "m4a"
      : mimeRef.current.includes("ogg")
        ? "ogg"
        : "webm";
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `${filename ?? "auto-reconnaissance"}-${stamp}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [audioUrl, filename]);

  if (state === "unsupported") {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
        Ton navigateur ne permet pas d'enregistrer ici. Ouvre l'app Dictaphone
        (ou Mémo vocal) de ton téléphone pour le faire à part.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-900">
            Dictaphone intégré
          </p>
          <p className="text-xs text-rose-900/70">
            Enregistrement local — rien n&apos;est envoyé à BeSerene.
          </p>
        </div>
        {state === "recording" ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            {formatDuration(duration)}
          </span>
        ) : duration > 0 ? (
          <span className="text-xs text-rose-900/70">
            {formatDuration(duration)}
          </span>
        ) : null}
      </div>

      {state === "idle" || state === "denied" ? (
        <button
          type="button"
          onClick={startRecording}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <span aria-hidden>🎙️</span>
          Démarrer l&apos;enregistrement
        </button>
      ) : null}

      {state === "recording" ? (
        <button
          type="button"
          onClick={stopRecording}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
        >
          <span aria-hidden>⏹</span>
          Arrêter
        </button>
      ) : null}

      {state === "stopped" && audioUrl ? (
        <div className="space-y-2">
          <audio
            src={audioUrl}
            controls
            className="w-full"
            preload="metadata"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadRecording}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-rose-300 bg-white px-3 py-2 text-xs font-medium text-rose-900 hover:bg-rose-100"
            >
              ⬇ Télécharger
            </button>
            <button
              type="button"
              onClick={resetRecording}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Recommencer
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="text-xs text-rose-700">{error}</p>
      ) : null}
    </div>
  );
}
