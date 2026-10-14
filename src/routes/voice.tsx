import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { VoiceWorkspace } from "@/components/Voice";
import { Reveal } from "@/components/Motion";
import { Mic, Shield, Sliders, Sparkles } from "lucide-react";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Voice Assistant — Vesper" },
      {
        name: "description",
        content:
          "Talk naturally with your clinical health companion. Local acoustic processing for private health consultations.",
      },
      { property: "og:title", content: "Voice Assistant — Vesper" },
      {
        property: "og:description",
        content: "Talk naturally with your clinical health companion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VoiceRoute,
});

function VoiceRoute() {
  return (
    <div className="max-w-4xl">
      <PageHead
        eyebrow="Acoustic Consultation"
        title={
          <>
            A quiet <em>conversation.</em>
          </>
        }
        lede="Speak freely about symptoms, medication schedules, or physical sensations. Vesper transcribes and interprets on your local hardware."
        aside={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-[12px] font-mono text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              <span>48.0 kHz · PCM</span>
            </div>
          </div>
        }
      />

      <Reveal delay={120}>
        <div className="mt-4">
          <VoiceWorkspace compact={false} />
        </div>
      </Reveal>

      {/* Voice Consultation Technical Telemetry */}
      <Reveal delay={240}>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/80 bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-foreground">
              <Mic className="size-3.5 stroke-[1.8] text-primary" />
              <span>Hardware Audio Engine</span>
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Low-latency WebAudio API capture with native automatic gain control.
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-foreground">
              <Shield className="size-3.5 stroke-[1.8] text-primary" />
              <span>Private & Local</span>
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Acoustic streams are analyzed locally and never stored in cloud databanks.
            </p>
          </div>

          <div className="rounded-lg border border-border/80 bg-surface/60 p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-foreground">
              <Sliders className="size-3.5 stroke-[1.8] text-primary" />
              <span>Voice Service Link</span>
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Optional WebSocket host endpoint can be set in Settings for LLM replies.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

