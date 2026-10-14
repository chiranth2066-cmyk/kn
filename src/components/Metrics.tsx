export const metrics = [
  { key: "hr", label: "Heart rate", unit: "bpm", sensor: "MAX30102" },
  { key: "spo2", label: "Blood oxygen", unit: "% SpO₂", sensor: "MAX30102" },
  { key: "temp", label: "Body temperature", unit: "°C", sensor: "MAX30205" },
] as const;

export function MetricStrip({ vertical = false }: { vertical?: boolean }) {
  return (
    <dl className={vertical ? "divide-y" : "grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"}>
      {metrics.map((m) => (
        <div key={m.key} className={vertical ? "py-5" : "py-5 sm:px-6 sm:first:pl-0"}>
          <dt className="eyebrow">{m.label}</dt>
          <dd className="mt-3 flex items-baseline gap-1.5">
            <span className="num text-[40px] font-medium leading-none tracking-tight text-muted-foreground/60">--</span>
            <span className="text-[12px] text-muted-foreground">{m.unit}</span>
          </dd>
          <dd className="mt-2.5 text-[12px] text-muted-foreground">Waiting for device · baseline not learned</dd>
        </div>
      ))}
    </dl>
  );
}
