import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { Reveal } from "@/components/Motion";
import {
  Cpu,
  Radio,
  Sliders,
  Shield,
  Save,
  Server,
  Mic,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Vesper" },
      {
        name: "description",
        content: "Configure ESP32 device address and voice inference service endpoints.",
      },
      { property: "og:title", content: "Settings — Vesper" },
      {
        property: "og:description",
        content: "Hardware bus and network endpoints for Vesper health companion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <div className="max-w-3xl space-y-10">
      <PageHead
        eyebrow="System Configuration"
        title={
          <>
            Hardware & <em>connections.</em>
          </>
        }
        lede="Configure your ESP32 sensor bridge and voice inference service network endpoints."
      />

      {/* Hardware Endpoints Form */}
      <Reveal delay={120}>
        <div className="rounded-xl border border-border/80 bg-surface/90 shadow-[0_2px_14px_rgba(0,0,0,0.02)]">
          <div className="border-b border-border/70 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 stroke-[1.8] text-primary" />
              <h2 className="text-[15px] font-semibold text-foreground">
                Microcontroller Bus Configuration
              </h2>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              Define the local network address of the ESP32 streaming MAX30102 and MAX30205 telemetry.
            </p>
          </div>

          <div className="divide-y divide-border/60 p-5 sm:p-6">
            {/* Field 1 */}
            <div className="py-4 first:pt-0">
              <label className="grid gap-2 sm:grid-cols-[14rem_1fr] sm:items-baseline">
                <div>
                  <span className="text-[13.5px] font-medium text-foreground">
                    ESP32 Device Endpoint
                  </span>
                  <p className="text-[11.5px] text-muted-foreground">
                    HTTP / WebSocket IP address
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="e.g. http://192.168.1.40:8080"
                  defaultValue=""
                  className="num rounded-md border border-border/80 bg-background/80 px-3 py-2 font-mono text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
            </div>

            {/* Field 2 */}
            <div className="py-4">
              <label className="grid gap-2 sm:grid-cols-[14rem_1fr] sm:items-baseline">
                <div>
                  <span className="text-[13.5px] font-medium text-foreground">
                    Voice Inference Service
                  </span>
                  <p className="text-[11.5px] text-muted-foreground">
                    Local LLM / STT WebSocket host
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="e.g. ws://localhost:5000/stream"
                  defaultValue=""
                  className="num rounded-md border border-border/80 bg-background/80 px-3 py-2 font-mono text-[13.5px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </label>
            </div>

            {/* Field 3 */}
            <div className="py-4 last:pb-0">
              <label className="grid gap-2 sm:grid-cols-[14rem_1fr] sm:items-baseline">
                <div>
                  <span className="text-[13.5px] font-medium text-foreground">
                    Telemetry Refresh Rate
                  </span>
                  <p className="text-[11.5px] text-muted-foreground">
                    Biometric polling interval
                  </p>
                </div>
                <select
                  defaultValue="1000"
                  className="rounded-md border border-border/80 bg-background/80 px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary"
                >
                  <option value="500">500ms (High precision)</option>
                  <option value="1000">1000ms (Standard clinical baseline)</option>
                  <option value="2000">2000ms (Power-saving mode)</option>
                </select>
              </label>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle bg-surface-subtle/40 p-4 sm:px-6">
            <span className="text-[12px] text-muted-foreground">
              Hardware pairing logic will be enabled in the firmware bridge update.
            </span>
            <button
              type="button"
              disabled
              title="Configuration saving will activate once hardware link is initiated"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground shadow-xs disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Save className="size-3.5" />
              <span>Save endpoints</span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* Diagnostics & Build Info */}
      <Reveal delay={220}>
        <div className="rounded-xl border border-border/70 bg-surface/50 p-6">
          <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
            <Info className="size-4 stroke-[1.8] text-muted-foreground" />
            <h3 className="text-[13px] font-semibold text-foreground">
              System & Firmware Specifications
            </h3>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-[12px]">
            <div>
              <span className="text-muted-foreground">Application Build:</span>
              <div className="font-mono text-foreground font-medium">Vesper 2.4.0 (Clinical)</div>
            </div>
            <div>
              <span className="text-muted-foreground">React & Router:</span>
              <div className="font-mono text-foreground font-medium">React 19 · TanStack Router</div>
            </div>
            <div>
              <span className="text-muted-foreground">Graphics Pipeline:</span>
              <div className="font-mono text-foreground font-medium">LiquidGL 3.0.0 (WebGPU)</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

