import { useCallback, useEffect, useRef, useState } from "react";

export type MicState = "checking" | "needs-permission" | "denied" | "unsupported" | "listening" | "muted" | "ended" | "error";

/** Real microphone lifecycle: checks permission, auto-starts when already granted, exposes live input level. */
export function useMicrophone() {
  const [state, setState] = useState<MicState>("checking");
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const starting = useRef(false);

  const stop = useCallback((next: MicState = "ended") => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setLevel(0);
    setState(next);
  }, []);

  const start = useCallback(async () => {
    if (starting.current || streamRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) return setState("unsupported");
    starting.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getAudioTracks()[0]?.addEventListener("ended", () => stop("error"));
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
      setState("listening");
    } catch (e) {
      setState((e as DOMException)?.name === "NotAllowedError" ? "denied" : "error");
    } finally {
      starting.current = false;
    }
  }, [stop]);

  const toggleMute = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setState(track.enabled ? "listening" : "muted");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) return setState("unsupported");
      try {
        const p = await navigator.permissions?.query({ name: "microphone" as PermissionName });
        if (cancelled) return;
        if (p?.state === "granted") start();
        else if (p?.state === "denied") setState("denied");
        else setState("needs-permission");
      } catch {
        setState("needs-permission");
      }
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [start, stop]);

  return { state, level: state === "listening" ? level : 0, start, stop, toggleMute };
}
