import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, MicOff, Square } from "lucide-react";
import { useMicrophone, type MicState } from "@/lib/voice";
import { StatusDot } from "./AppShell";

type Msg = { role: "user" | "assistant" | "system"; text: string; at: Date };

const label: Record<MicState, string> = {
  checking: "Connecting",
  "needs-permission": "Waiting for microphone",
  denied: "Microphone blocked",
  unsupported: "Microphone unavailable",
  listening: "Listening",
  muted: "Paused",
  ended: "Session ended",
  error: "Disconnected",
};

function Level({ level }: { level: number }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.6, 1, 0.8, 0.5].map((w, i) => (
        <span key={i} className="w-[2px] bg-primary transition-[height] duration-100" style={{ height: `${Math.max(2, level * w * 12)}px` }} />
      ))}
    </span>
  );
}

export function VoiceWorkspace({ compact = false }: { compact?: boolean }) {
  const mic = useMicrophone();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMsgs((m) => [
      ...m,
      { role: "user", text, at: new Date() },
      { role: "system", text: "The voice service isn't linked yet, so there's no reply. Connect it in Settings.", at: new Date() },
    ]);
  };

  const live = mic.state === "listening";
  const tone = live ? "live" : mic.state === "muted" ? "warn" : "off";

  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2.5 text-[12.5px] font-medium">
          <StatusDot tone={tone} />
          <span>{label[mic.state]}</span>
          {live && <Level level={mic.level} />}
        </div>
        {(live || mic.state === "muted") && (
          <div className="flex items-center gap-1">
            <button onClick={mic.toggleMute} className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
              {live ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}{live ? "Mute" : "Resume"}
            </button>
            <button onClick={() => mic.stop()} className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-destructive">
              <Square className="size-3" />End
            </button>
          </div>
        )}
      </div>

      <div ref={scroller} className={`rule overflow-y-auto ${compact ? "h-[340px]" : "h-[min(56vh,560px)]"}`}>
        {mic.state === "needs-permission" || mic.state === "ended" || mic.state === "denied" || mic.state === "error" ? (
          <div className="flex h-full flex-col items-start justify-center gap-5 py-10">
            <p className="display-md max-w-sm">
              {mic.state === "denied" ? "Your microphone is blocked." : mic.state === "ended" ? "Session ended." : "Speak, and I'll listen."}
            </p>
            <p className="max-w-sm text-muted-foreground">
              {mic.state === "denied"
                ? "Allow microphone access in your browser's site settings, then reload this page."
                : "Your voice stays private. Allow microphone access once and the assistant will start listening each time you open the app."}
            </p>
            {mic.state !== "denied" && (
              <button onClick={mic.start} className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                <Mic className="size-3.5" />{mic.state === "ended" ? "Start again" : "Allow microphone"}
              </button>
            )}
          </div>
        ) : msgs.length === 0 ? (
          <div className="flex h-full items-center py-10">
            <p className="display-md max-w-md text-muted-foreground">
              {mic.state === "unsupported" ? "Voice needs a secure connection. You can still type below." : <>Whenever you're ready, <em>just speak.</em></>}
            </p>
          </div>
        ) : (
          <ol className="space-y-7 py-8">
            {msgs.map((m, i) => (
              <li key={i} className={m.role === "user" ? "ml-auto max-w-[78%] border-r-2 border-primary pr-4 text-right" : "max-w-[62ch]"}>
                <div className="eyebrow mb-1.5 num">{m.role === "user" ? "You" : m.role === "system" ? "Notice" : "Vesper"} · {m.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <p className={m.role === "system" ? "text-muted-foreground" : "text-[15px] leading-relaxed"}>{m.text}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="rule flex items-center gap-3 pt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Or type a message…"
          className="flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-muted-foreground"
          aria-label="Message"
        />
        <button type="submit" disabled={!draft.trim()} aria-label="Send" className="grid size-9 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-25">
          <ArrowUp className="size-4" />
        </button>
      </form>
    </section>
  );
}
