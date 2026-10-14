import { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowUp,
  Mic,
  MicOff,
  Square,
  Shield,
  Volume2,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useMicrophone, type MicState } from "@/lib/voice";
import { StatusDot } from "./AppShell";
import { GlassLayer } from "./LiquidGlass";

type Msg = { role: "user" | "assistant" | "system"; text: string; at: Date };

const stateLabels: Record<
  MicState,
  { label: string; tone: "ok" | "off" | "warn" | "live"; description: string }
> = {
  checking: {
    label: "Checking audio bus",
    tone: "off",
    description: "Querying browser media permissions…",
  },
  "needs-permission": {
    label: "Microphone standby",
    tone: "warn",
    description: "Awaiting user audio permission.",
  },
  denied: {
    label: "Microphone blocked",
    tone: "warn",
    description: "Permission denied in browser site settings.",
  },
  unsupported: {
    label: "Audio unavailable",
    tone: "off",
    description: "Browser or context does not support WebAudio.",
  },
  listening: {
    label: "Calibrated & listening",
    tone: "live",
    description: "Live 48kHz audio telemetry active.",
  },
  muted: {
    label: "Signal paused",
    tone: "warn",
    description: "Audio stream muted locally.",
  },
  ended: {
    label: "Consultation ended",
    tone: "off",
    description: "Microphone session closed.",
  },
  error: {
    label: "Audio disconnected",
    tone: "warn",
    description: "Microphone input lost or disconnected.",
  },
};

/**
 * High-precision minimal acoustic frequency bars
 * Animates smoothly responding to real mic.level
 */
function AudioVisualizer({ level, active }: { level: number; active: boolean }) {
  // 18 symmetrically arranged acoustic bars
  const barWeights = useMemo(
    () => [
      0.25, 0.4, 0.6, 0.85, 1.0, 1.25, 1.4, 1.5, 1.6, 1.6, 1.5, 1.4, 1.25,
      1.0, 0.85, 0.6, 0.4, 0.25,
    ],
    []
  );

  return (
    <div className="flex h-10 items-center justify-center gap-[3px] px-3 py-1">
      {barWeights.map((weight, i) => {
        // Target height calculation based on input level
        const baseHeight = active ? 4 : 2;
        const dynamicHeight = active
          ? Math.max(baseHeight, Math.min(32, Math.round(level * weight * 30 + (i % 2 === 0 ? 3 : 1))))
          : baseHeight;

        return (
          <span
            key={i}
            className={`w-[2.5px] rounded-full transition-all duration-75 ${
              active
                ? level > 0.1
                  ? "bg-primary"
                  : "bg-primary/50"
                : "bg-border"
            }`}
            style={{
              height: `${dynamicHeight}px`,
              opacity: active ? 0.6 + level * 0.4 : 0.35,
            }}
          />
        );
      })}
    </div>
  );
}

export function VoiceWorkspace({ compact = false }: { compact?: boolean }) {
  const mic = useMicrophone();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 140) {
      el.scrollTop = el.scrollHeight;
    }
  }, [msgs]);

  const send = (textToSend?: string) => {
    const text = (textToSend || draft).trim();
    if (!text) return;
    setDraft("");
    setMsgs((m) => [
      ...m,
      { role: "user", text, at: new Date() },
      {
        role: "system",
        text: "The voice inference service isn't linked yet, so there is no audio response. Configure the service host in Settings.",
        at: new Date(),
      },
    ]);
  };

  const isLive = mic.state === "listening";
  const stateMeta = stateLabels[mic.state];

  return (
    <div className="glass-host relative flex flex-col rounded-xl border border-border/80 bg-surface/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] backdrop-blur-sm">
      <GlassLayer />

      {/* Acoustic Instrument Header */}
      <div
        data-liquid-ignore
        className="glass-content flex flex-wrap items-center justify-between border-b border-border/70 px-5 py-3.5 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <StatusDot tone={stateMeta.tone} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold tracking-tight text-foreground">
                {stateMeta.label}
              </span>
              {isLive && (
                <span className="num rounded bg-emerald-600/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
                  LIVE PCM
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {stateMeta.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          {(isLive || mic.state === "muted") && (
            <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 p-1">
              <button
                type="button"
                onClick={mic.toggleMute}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium text-foreground hover:bg-surface"
              >
                {isLive ? (
                  <>
                    <MicOff className="size-3.5 stroke-[1.8] text-muted-foreground" />
                    <span>Mute</span>
                  </>
                ) : (
                  <>
                    <Mic className="size-3.5 stroke-[1.8] text-emerald-700" />
                    <span>Resume</span>
                  </>
                )}
              </button>
              <div className="h-3.5 w-px bg-border" />
              <button
                type="button"
                onClick={() => mic.stop()}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Square className="size-3 stroke-[2]" />
                <span>End</span>
              </button>
            </div>
          )}

          {mic.state === "needs-permission" && (
            <button
              type="button"
              onClick={mic.start}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 text-[12.5px] font-semibold text-primary-foreground shadow-xs transition-transform hover:bg-primary-hover active:scale-98"
            >
              <Mic className="size-3.5 stroke-[2]" />
              <span>Allow microphone</span>
            </button>
          )}

          {mic.state === "ended" && (
            <button
              type="button"
              onClick={mic.start}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-surface-subtle"
            >
              <Mic className="size-3.5 stroke-[1.8]" />
              <span>New session</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div
        ref={scroller}
        data-liquid-ignore
        className={`glass-content overflow-y-auto px-5 sm:px-7 ${
          compact ? "h-[360px]" : "h-[min(54vh,540px)]"
        }`}
      >
        {mic.state === "needs-permission" ||
        mic.state === "ended" ||
        mic.state === "denied" ||
        mic.state === "error" ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <div className="relative mb-5 flex size-16 items-center justify-center rounded-full border border-border bg-surface-subtle shadow-inner">
              {mic.state === "denied" ? (
                <AlertCircle className="size-7 stroke-[1.6] text-amber-700" />
              ) : (
                <Mic className="size-7 stroke-[1.6] text-primary" />
              )}
              {mic.state === "needs-permission" && (
                <span className="absolute -inset-1.5 rounded-full border border-primary/20 animate-pulse-ring" />
              )}
            </div>

            <h2 className="display-sm max-w-md font-normal text-foreground">
              {mic.state === "denied"
                ? "Microphone access is blocked."
                : mic.state === "ended"
                ? "Voice consultation ended."
                : "A quiet space to speak."}
            </h2>

            <p className="mt-2.5 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
              {mic.state === "denied"
                ? "Click the lock icon in your browser address bar to allow microphone input, then refresh."
                : mic.state === "ended"
                ? "Your session notes have been recorded in the local transcript."
                : "Vesper processes your voice locally for clinical vitals and reminders. Audio never leaves your hardware without permission."}
            </p>

            {mic.state !== "denied" && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={mic.start}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary-hover active:scale-98"
                >
                  <Mic className="size-4 stroke-[2]" />
                  <span>
                    {mic.state === "ended" ? "Start again" : "Connect microphone"}
                  </span>
                </button>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                  <Shield className="size-3 text-emerald-800" />
                  <span>Hardware privacy guaranteed</span>
                </div>
              </div>
            )}
          </div>
        ) : msgs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            {/* Live Audio Visualizer Dial */}
            <div className="mb-5 flex flex-col items-center">
              <AudioVisualizer level={mic.level} active={isLive} />
              <div className="mt-2 flex items-center gap-2 text-[11px] tracking-wider text-muted-foreground uppercase">
                <span className="font-mono num">
                  {isLive ? `${Math.round(mic.level * 100)}% VU` : "STANDBY"}
                </span>
                <span className="text-border">·</span>
                <span>20Hz - 8kHz</span>
              </div>
            </div>

            <p className="display-md max-w-md font-normal text-foreground">
              {mic.state === "unsupported" ? (
                "Microphone input requires a secure browser context."
              ) : (
                <>
                  Whenever you are ready, <em>speak naturally.</em>
                </>
              )}
            </p>
            <p className="mt-2 max-w-sm text-[13px] text-muted-foreground">
              Ask about your medication schedule, resting heart rate baseline, or
              log a daily health note.
            </p>

            {/* Suggested Prompts */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Check baseline vitals",
                "When is my next medicine dose?",
                "Log blood pressure reading",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-border/80 bg-surface px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-primary/50 hover:bg-surface-subtle hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  m.role === "user"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-[11px]">
                  <span className="font-semibold text-foreground/80">
                    {m.role === "user" ? "You" : m.role === "system" ? "Clinical System" : "Vesper"}
                  </span>
                  <span className="text-border">·</span>
                  <span className="num text-muted-foreground">
                    {m.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-lg p-3.5 text-[14px] leading-relaxed sm:max-w-[75%] ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : m.role === "system"
                      ? "border border-amber-600/30 bg-amber-50/50 text-foreground"
                      : "border border-border/80 bg-surface text-foreground shadow-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div
        data-liquid-ignore
        className="glass-content border-t border-border/70 p-3 sm:p-4"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-background/90 px-3.5 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20"
        >
          {isLive && (
            <div className="hidden sm:block">
              <AudioVisualizer level={mic.level} active={isLive} />
            </div>
          )}
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={isLive ? "Speak now or type a health question…" : "Type a health message…"}
            className="flex-1 bg-transparent py-1.5 text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Health message input"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground transition-all disabled:opacity-30 disabled:hover:opacity-30 hover:bg-primary-hover active:scale-95"
          >
            <ArrowUp className="size-4 stroke-[2]" />
          </button>
        </form>
      </div>
    </div>
  );
}

