import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Offline, PageHead } from "@/components/AppShell";
import { Reveal } from "@/components/Motion";
import {
  Clock,
  Pill,
  Sun,
  Sunset,
  Moon,
  Check,
  Edit2,
  Sparkles,
  BellRing,
  Lightbulb,
} from "lucide-react";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Medicine Reminders — Vesper" },
      {
        name: "description",
        content:
          "Morning, afternoon and evening medicine reminders with acoustic voice chime and hardware LED illumination alerts.",
      },
      { property: "og:title", content: "Medicine Reminders — Vesper" },
      {
        property: "og:description",
        content: "A calm, precise medicine schedule for your daily health regimen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reminders,
});

const periods = [
  {
    id: "Morning",
    label: "Morning Regimen",
    icon: Sun,
    defaultTime: "08:00",
    description: "Take with breakfast and a glass of water.",
    ledCue: "Soft amber breathing LED",
  },
  {
    id: "Afternoon",
    label: "Midday Check",
    icon: Sunset,
    defaultTime: "13:00",
    description: "Post-lunch check-in and hydration reminder.",
    ledCue: "Calm green pulse LED",
  },
  {
    id: "Evening",
    label: "Evening Regimen",
    icon: Moon,
    defaultTime: "20:00",
    description: "Nightly medication before rest cycle.",
    ledCue: "Dim warm ivory beacon",
  },
] as const;

function Reminders() {
  const [times, setTimes] = useState<Record<string, string>>({
    Morning: "08:00",
    Afternoon: "13:00",
    Evening: "20:00",
  });
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="max-w-3xl space-y-10">
      <PageHead
        eyebrow="Medication Schedule"
        title={
          <>
            Three moments <em>a day.</em>
          </>
        }
        lede="Set when you would like to be alerted. Vesper will provide an acoustic chime and your ESP32 device will gently illuminate."
      />

      {/* Schedule Editor Card */}
      <Reveal delay={120}>
        <div className="rounded-xl border border-border/80 bg-surface/90 shadow-[0_2px_14px_rgba(0,0,0,0.02)]">
          <div className="divide-y divide-border/60">
            {periods.map((p, i) => {
              const Icon = p.icon;
              const isEditing = editing === p.id;
              const currentTime = times[p.id];

              return (
                <div
                  key={p.id}
                  className="p-5 transition-colors sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Period Label & Context */}
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-surface-subtle text-primary">
                        <Icon className="size-5 stroke-[1.6]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="num font-mono text-[11px] text-muted-foreground/70">
                            0{i + 1}
                          </span>
                          <span className="text-[15px] font-semibold text-foreground">
                            {p.label}
                          </span>
                          <span className="num rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            Local Memory
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                          {p.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                          <Lightbulb className="size-3 text-amber-600/70" />
                          <span>{p.ledCue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Value / Inline Input */}
                    <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            autoFocus
                            value={currentTime}
                            onChange={(e) =>
                              setTimes({ ...times, [p.id]: e.target.value })
                            }
                            onBlur={() => setEditing(null)}
                            className="num rounded-md border border-primary bg-background px-3 py-1 text-[26px] font-medium text-foreground outline-none shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary-hover"
                            title="Confirm time"
                          >
                            <Check className="size-4 stroke-[2]" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="num font-mono text-[32px] font-medium leading-none tracking-tight text-foreground">
                            {currentTime}
                          </span>
                          <span className="font-mono text-[12px] text-muted-foreground">
                            HRS
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setEditing(p.id)}
                          className="flex items-center gap-1.5 rounded-md border border-border/70 bg-surface px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          <Edit2 className="size-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-surface-subtle/40 p-4 sm:px-6">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-amber-600/60" />
              <span>Times stored locally · Sync pending hardware connection</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                title="Hardware offline — establish ESP32 connection in Settings first"
                className="rounded-md border border-border/80 bg-surface px-4 py-2 text-[12.5px] font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Test voice & LED chime
              </button>
              <button
                type="button"
                disabled
                title="Hardware offline — establish ESP32 connection in Settings first"
                className="rounded-md bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground shadow-xs disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save to device EEPROM
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Voice Prompt Tip */}
      <Reveal delay={220}>
        <div className="rounded-lg border border-border/70 bg-surface/50 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="size-4 shrink-0 stroke-[1.8] text-primary mt-0.5" />
            <div className="text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">Natural voice command:</span>{" "}
              You can also adjust your schedule hands-free in the Voice Workspace by saying:{" "}
              <em className="text-foreground">"Vesper, update my morning reminder to eight thirty."</em>
            </div>
          </div>
        </div>
      </Reveal>

      <Offline>
        Saving to hardware and testing notification alarms requires an active ESP32 connection.
        Your configured schedule is currently saved in your browser session.
      </Offline>
    </div>
  );
}

