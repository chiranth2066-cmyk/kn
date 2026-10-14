import { Activity, Droplets, Thermometer, Radio } from "lucide-react";

export const metrics = [
  {
    key: "hr",
    label: "Resting heart rate",
    shortLabel: "Heart rate",
    unit: "bpm",
    sensor: "MAX30102",
    range: "60–100 bpm",
    icon: Activity,
    calibration: "PPG Optical",
  },
  {
    key: "spo2",
    label: "Blood oxygen saturation",
    shortLabel: "SpO₂",
    unit: "%",
    sensor: "MAX30102",
    range: "95–100%",
    icon: Droplets,
    calibration: "Dual Wavelength",
  },
  {
    key: "temp",
    label: "Clinical body temp",
    shortLabel: "Temperature",
    unit: "°C",
    sensor: "MAX30205",
    range: "36.5–37.5°C",
    icon: Thermometer,
    calibration: "±0.1°C Accuracy",
  },
] as const;

export function MetricStrip({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className={
        vertical
          ? "divide-y divide-border/60"
          : "grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      }
    >
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.key}
            className={`group relative ${
              vertical
                ? "py-4 first:pt-0 last:pb-0"
                : "py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0"
            }`}
          >
            {/* Header: Label & Sensor chip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon className="size-3.5 stroke-[1.8] text-muted-foreground/80" />
                <span className="eyebrow text-[9.5px] tracking-[0.14em] text-muted-foreground">
                  {m.shortLabel}
                </span>
              </div>
              <span className="font-mono text-[9px] font-medium tracking-wider text-muted-foreground/60 uppercase">
                {m.sensor}
              </span>
            </div>

            {/* Value Readout: Honest Waiting State */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="num font-display text-[38px] font-normal leading-none tracking-tight text-foreground/40">
                --
              </span>
              <span className="font-mono text-[12px] font-medium text-muted-foreground">
                {m.unit}
              </span>
            </div>

            {/* Calibration & Clinical Context Footer */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-1 rounded-full bg-border" />
                <span>Awaiting touch</span>
              </span>
              <span className="num font-mono text-[10px] text-muted-foreground/70">
                Ref: {m.range}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MetricCard({
  metric,
  value = "--",
  status = "Waiting for device contact",
  live = false,
}: {
  metric: (typeof metrics)[number];
  value?: string;
  status?: string;
  live?: boolean;
}) {
  const Icon = metric.icon;

  return (
    <div className="rounded-xl border border-border/80 bg-surface/90 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md border border-border/70 bg-surface-subtle">
            <Icon className="size-4 stroke-[1.6] text-primary" />
          </div>
          <div>
            <span className="eyebrow text-[9.5px]">{metric.label}</span>
            <div className="text-[11px] text-muted-foreground">
              {metric.calibration}
            </div>
          </div>
        </div>
        <span className="num rounded bg-surface-subtle px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {metric.sensor}
        </span>
      </div>

      <div className="mt-6 flex items-baseline gap-2.5">
        <span className="num font-display text-[46px] font-normal leading-none tracking-tight text-foreground/50">
          {value}
        </span>
        <span className="font-mono text-[14px] font-medium text-muted-foreground">
          {metric.unit}
        </span>
      </div>

      {/* Calibration guideline bar */}
      <div className="mt-4 border-t border-border-subtle pt-3">
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className={`size-1.5 rounded-full ${
                live ? "bg-emerald-600 animate-breathe" : "bg-border"
              }`}
            />
            {status}
          </span>
          <span className="num font-mono text-[10.5px] text-muted-foreground/80">
            Target: {metric.range}
          </span>
        </div>
      </div>
    </div>
  );
}

