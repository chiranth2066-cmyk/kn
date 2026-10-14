import { createFileRoute } from "@tanstack/react-router";
import { Offline, PageHead, StatusDot } from "@/components/AppShell";
import { Reveal, Spotlight } from "@/components/Motion";
import {
  Activity,
  Droplets,
  Thermometer,
  Cpu,
  Info,
  Layers,
  ZapOff,
} from "lucide-react";

export const Route = createFileRoute("/sensors")({
  head: () => ({
    meta: [
      { title: "Live Sensors — Vesper" },
      {
        name: "description",
        content:
          "Scan heart rate, SpO₂ and clinical body temperature from your ESP32 MAX30102 and MAX30205 sensor modules.",
      },
      { property: "og:title", content: "Live Sensors — Vesper" },
      {
        property: "og:description",
        content:
          "Instrument-grade live readings from MAX30102 and MAX30205 clinical sensors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sensors,
});

const modules = [
  {
    name: "MAX30102",
    title: "Pulse Oximeter & PPG Heart Rate",
    role: "Optical Biometrics",
    i2c: "0x57",
    rates: "100 Hz Sample Rate · 18-bit ADC",
    reads: [
      { label: "Resting pulse", unit: "bpm", range: "60–100 bpm", icon: Activity },
      { label: "Blood oxygen", unit: "% SpO₂", range: "95–100%", icon: Droplets },
    ],
    action: "Scan pulse & SpO₂",
    spec: "Dual Red/IR optical photoplethysmography with ambient light cancellation",
  },
  {
    name: "MAX30205",
    title: "Clinical Body Temperature",
    role: "Thermal Instrumentation",
    i2c: "0x48",
    rates: "0.1 Hz Integration · 16-bit Sigma-Delta",
    reads: [
      { label: "Core temperature", unit: "°C", range: "36.5–37.5°C", icon: Thermometer },
    ],
    action: "Scan temperature",
    spec: "Meets ASTM E1112 clinical thermometer specification with ±0.1°C accuracy",
  },
];

function SensorButton({
  children,
  primary,
}: {
  children: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      disabled
      title="Hardware offline — establish ESP32 connection in Settings first"
      className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[12px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? "bg-primary text-primary-foreground shadow-xs"
          : "border border-border/80 bg-surface text-foreground"
      }`}
    >
      <ZapOff className="size-3 text-muted-foreground/80" />
      <span>{children}</span>
    </button>
  );
}

function Sensors() {
  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="Hardware Instrumentation"
        title={
          <>
            Instruments, <em>at rest.</em>
          </>
        }
        lede="Biometric telemetry from medical-grade MAX30102 and MAX30205 sensors attached to your ESP32 microcontroller."
        aside={
          <div className="flex items-center gap-2">
            <SensorButton primary>Start calibration scan</SensorButton>
            <SensorButton>Halt bus</SensorButton>
          </div>
        }
      />

      <Offline>
        The ESP32 microcontroller is currently offline or disconnected from the local network.
        Sensor channels will calibrate and display live waveform signals automatically once
        the device establishes a handshake.
      </Offline>

      {/* Sensor Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((m, i) => (
          <Reveal key={m.name} delay={i * 120}>
            <Spotlight className="h-full rounded-xl border border-border/80 bg-surface/90 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
              <section className="flex h-full flex-col justify-between p-6 sm:p-7">
                <div>
                  {/* Module Header */}
                  <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="eyebrow text-[9.5px]">{m.role}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          I²C {m.i2c}
                        </span>
                      </div>
                      <h2 className="mt-1 font-display text-[26px] leading-tight text-foreground">
                        {m.name}
                      </h2>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {m.title}
                      </p>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-border/70 bg-surface-subtle px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      <StatusDot tone="off" />
                      <span>Standby</span>
                    </span>
                  </div>

                  {/* Vitals Readout Cards */}
                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    {m.reads.map((r) => {
                      const Icon = r.icon;
                      return (
                        <div
                          key={r.label}
                          className="rounded-lg border border-border/60 bg-surface-subtle/50 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="eyebrow text-[9px]">{r.label}</span>
                            <Icon className="size-3.5 stroke-[1.8] text-muted-foreground/80" />
                          </div>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="num font-display text-[40px] font-normal leading-none text-foreground/40">
                              --
                            </span>
                            <span className="font-mono text-[12px] font-medium text-muted-foreground">
                              {r.unit}
                            </span>
                          </div>
                          <div className="mt-2 text-[11px] text-muted-foreground/80">
                            Reference: {r.range}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Specification Note */}
                  <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
                    {m.spec}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-8 border-t border-border-subtle pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                      <Info className="size-3" />
                      <span>{m.rates}</span>
                    </div>
                    <SensorButton>{m.action}</SensorButton>
                  </div>
                </div>
              </section>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      {/* Hardware Bus Diagnostic Panel */}
      <Reveal delay={280}>
        <div className="rounded-xl border border-border/70 bg-surface/60 p-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 stroke-[1.8] text-primary" />
              <h3 className="text-[13.5px] font-semibold text-foreground">
                Microcontroller Bus Telemetry
              </h3>
            </div>
            <span className="num font-mono text-[11px] text-muted-foreground">
              SDA: GPIO21 · SCL: GPIO22
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-4 text-[12.5px]">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Bus Interface
              </div>
              <div className="mt-1 font-mono font-medium text-foreground">
                I²C Fast Mode (400kHz)
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Target MCU
              </div>
              <div className="mt-1 font-mono font-medium text-foreground">
                ESP32-S3-WROOM-1
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Sensor Rail
              </div>
              <div className="mt-1 font-mono font-medium text-foreground">
                3.3V Ultra-Low-Noise LDO
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                ADC Resolution
              </div>
              <div className="mt-1 font-mono font-medium text-foreground">
                18-bit Optical / 16-bit Temp
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

