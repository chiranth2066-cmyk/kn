import { createFileRoute } from "@tanstack/react-router";
import { RotateCw, Calendar, FileDown, Shield, Database } from "lucide-react";
import { PageHead } from "@/components/AppShell";
import { Reveal } from "@/components/Motion";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Reading History — Vesper" },
      {
        name: "description",
        content:
          "Audit trail and record of every recorded heart rate, SpO₂ and temperature reading.",
      },
      { property: "og:title", content: "Reading History — Vesper" },
      {
        property: "og:description",
        content: "A precise, clinical record of your saved health readings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: History,
});

function History() {
  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="Clinical Telemetry Log"
        title={
          <>
            The <em>record.</em>
          </>
        }
        lede="Calibrated historical measurements from your MAX30102 and MAX30205 sensors, timestamped with local hardware verification."
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-surface px-3 py-1.5 shadow-2xs">
              <Calendar className="size-3.5 stroke-[1.8] text-muted-foreground" />
              <input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                aria-label="Filter records by date"
                className="num bg-transparent text-[12.5px] font-medium text-foreground outline-none"
              />
            </div>
            <button
              type="button"
              disabled
              title="History service offline"
              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3.5 py-2 text-[12.5px] font-semibold text-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCw className="size-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      {/* Historical Telemetry Table Card */}
      <Reveal delay={120}>
        <div className="overflow-hidden rounded-xl border border-border/80 bg-surface/90 shadow-[0_2px_14px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-border/70 bg-surface-subtle/50">
                  <th className="eyebrow px-6 py-3.5 font-semibold text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="eyebrow px-6 py-3.5 text-right font-semibold text-muted-foreground">
                    Heart Rate (bpm)
                  </th>
                  <th className="eyebrow px-6 py-3.5 text-right font-semibold text-muted-foreground">
                    SpO₂ (%)
                  </th>
                  <th className="eyebrow px-6 py-3.5 text-right font-semibold text-muted-foreground">
                    Temperature (°C)
                  </th>
                  <th className="eyebrow px-6 py-3.5 text-center font-semibold text-muted-foreground">
                    Sensor Bus
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border/80 bg-surface-subtle text-muted-foreground/60">
                      <Database className="size-5 stroke-[1.6]" />
                    </div>
                    <h3 className="display-sm mt-4 font-normal text-foreground">
                      No readings recorded yet.
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                      Continuous and spot measurements will appear in this clinical
                      ledger as soon as your ESP32 streams sensor telemetry.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <span className="num font-mono text-[11px] text-muted-foreground/70">
                        STORAGE PROTOCOL · LOCAL INDEXEDDB / SQLITE
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex flex-wrap items-center justify-between border-t border-border-subtle bg-surface-subtle/30 px-6 py-3 text-[12px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-emerald-700/80" />
              <span>Cryptographically signed local logs</span>
            </div>
            <div className="font-mono num text-[11px]">0 records found</div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

