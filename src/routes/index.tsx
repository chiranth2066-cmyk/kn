import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHead } from "@/components/AppShell";
import { VoiceWorkspace } from "@/components/Voice";
import { MetricStrip } from "@/components/Metrics";
import { BlurText, Reveal } from "@/components/Motion";
import { CinematicIntro } from "@/components/CinematicIntro";
import {
  ArrowUpRight,
  Pill,
  Activity,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Film,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Vesper Health Companion" },
      {
        name: "description",
        content:
          "Your voice-first health companion: clinical vitals, intelligent reminders and natural conversation in one calm place.",
      },
      { property: "og:title", content: "Overview — Vesper Health Companion" },
      {
        property: "og:description",
        content:
          "Voice-first health companion for heart rate, SpO₂, temperature and medicine reminders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function getEditorialGreeting() {
  const h = new Date().getHours();
  if (h < 12) {
    return {
      greeting: "Good morning.",
      accent: "A calm start.",
      lede: "Your biological signals are at rest. Connect your microphone to begin today's consultation.",
    };
  }
  if (h < 18) {
    return {
      greeting: "Good afternoon.",
      accent: "Midday check-in.",
      lede: "Vesper is listening. Review your afternoon medicine schedule or check your vital baselines.",
    };
  }
  return {
    greeting: "Good evening.",
    accent: "Resting cycle.",
    lede: "Review today's health notes and configure evening reminders before nightfall.",
  };
}

const medicineSchedule = [
  {
    period: "Morning",
    time: "08:00",
    dosage: "Morning regimen",
    status: "Configured (Local)",
    pending: true,
  },
  {
    period: "Afternoon",
    time: "13:00",
    dosage: "Midday vitals check",
    status: "Configured (Local)",
    pending: true,
  },
  {
    period: "Evening",
    time: "20:00",
    dosage: "Evening dose",
    status: "Configured (Local)",
    pending: true,
  },
];

function Index() {
  const [forceIntro, setForceIntro] = useState(false);
  const { greeting, accent, lede } = getEditorialGreeting();
  const dateFormatted = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Cinematic Opening Film Sequence */}
      <CinematicIntro
        forceShow={forceIntro}
        onEnter={() => setForceIntro(false)}
      />

      {/* Editorial Header */}
      <PageHead
        eyebrow={dateFormatted}
        title={
          <span suppressHydrationWarning className="flex flex-wrap items-baseline gap-x-3">
            <BlurText text={greeting} />
            <em className="font-display italic font-normal text-primary">
              {accent}
            </em>
          </span>
        }
        lede={lede}
        aside={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setForceIntro(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface/80 px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-surface hover:text-foreground shadow-2xs"
              title="Play opening cinematic film"
            >
              <Film className="size-3.5 stroke-[1.8] text-primary" />
              <span>Cinematic Film</span>
            </button>
            <div className="hidden sm:block rounded-lg border border-border/80 bg-surface/80 px-3 py-1.5 text-[12px] text-muted-foreground shadow-2xs">
              <span className="font-semibold text-foreground">Clinic Mode:</span>{" "}
              <span>Personal Hardware</span>
            </div>
          </div>
        }
      />

      {/* Primary Layout Grid: Signature Voice Workspace + Precision Instrumentation Rail */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left Column: Principal Voice Experience */}
        <div className="space-y-8">
          <Reveal delay={200}>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="eyebrow text-[9.5px]">Voice Workspace</span>
                  <span className="text-border">·</span>
                  <span className="text-[11.5px] text-muted-foreground">
                    Acoustic Telemetry
                  </span>
                </div>
                <Link
                  to="/voice"
                  className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Fullscreen workspace</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              {/* The Voice Workspace */}
              <VoiceWorkspace compact />
            </div>
          </Reveal>

          {/* Quick Guidance / System Philosophy */}
          <Reveal delay={340}>
            <div className="rounded-xl border border-border/70 bg-surface/50 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-surface text-primary">
                  <Sparkles className="size-4 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground">
                    Voice-first health companion
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    Speak into the microphone to ask clinical questions, set medication
                    reminders, or monitor your vitals. Speech interpretation and data
                    records remain strictly on your local device.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Vitals Panel & Medicine Schedule */}
        <Reveal delay={300}>
          <aside className="space-y-8">
            {/* Live Vitals Instrumentation Panel */}
            <div className="rounded-xl border border-border/80 bg-surface/90 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-baseline justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 stroke-[1.8] text-primary" />
                  <h2 className="text-[14px] font-semibold text-foreground">
                    Vitals Telemetry
                  </h2>
                </div>
                <Link
                  to="/sensors"
                  className="group flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Live sensors</span>
                  <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="mt-2">
                <MetricStrip vertical />
              </div>

              <div className="mt-4 border-t border-border-subtle pt-3">
                <p className="text-[11px] leading-normal text-muted-foreground">
                  Connect ESP32 via USB or Wi-Fi to begin real-time optical PPG and
                  temperature streaming.
                </p>
              </div>
            </div>

            {/* Today's Medicine Schedule */}
            <div className="rounded-xl border border-border/80 bg-surface/90 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-baseline justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="size-4 stroke-[1.8] text-primary" />
                  <h2 className="text-[14px] font-semibold text-foreground">
                    Today's Regimen
                  </h2>
                </div>
                <Link
                  to="/reminders"
                  className="group flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>Edit times</span>
                  <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <ul className="mt-1 divide-y divide-border/60">
                {medicineSchedule.map((item) => (
                  <li
                    key={item.period}
                    className="flex items-center justify-between py-3 text-[13px]"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <Clock className="size-3.5 stroke-[1.6] text-muted-foreground/80" />
                        <span>{item.period}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.dosage}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="num font-mono text-[16px] font-semibold tracking-tight text-foreground">
                        {item.time}
                      </span>
                      <div className="mt-0.5">
                        <span className="num rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          Not synced
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-border-subtle pt-3">
                <Link
                  to="/reminders"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:bg-surface-subtle"
                >
                  <span>Manage daily schedule</span>
                </Link>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>

      {/* Clinical Footnote & Verification */}
      <div className="mt-16 border-t border-border/80 pt-6">
        <div className="flex flex-col gap-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 max-w-xl text-[12px] leading-relaxed">
            <ShieldAlert className="size-4 shrink-0 stroke-[1.6] text-muted-foreground/80 mt-0.5" />
            <p>
              Vesper is an informational wellness companion and hardware interface. It is
              not a certified medical diagnostic device. Please consult a qualified
              medical practitioner for diagnostic analysis.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground/70 sm:self-auto">
            <span>HW-REV: S3-MAX</span>
            <span>·</span>
            <span>AES-256 LOCAL</span>
          </div>
        </div>
      </div>
    </>
  );
}

