import { createFileRoute } from "@tanstack/react-router";
import { Offline, PageHead, StatusDot } from "@/components/AppShell";
import { Reveal, Spotlight } from "@/components/Motion";

export const Route = createFileRoute("/sensors")({
  head: () => ({
    meta: [
      { title: "Live sensors — Vesper" },
      { name: "description", content: "Scan heart rate, SpO₂ and body temperature from your ESP32 device." },
      { property: "og:title", content: "Live sensors — Vesper" },
      { property: "og:description", content: "Instrument-grade live readings from MAX30102 and MAX30205 sensors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sensors,
});

const modules = [
  { name: "MAX30102", role: "Pulse oximetry", reads: [["Heart rate", "bpm"], ["SpO₂", "%"]], action: "Scan pulse & SpO₂" },
  { name: "MAX30205", role: "Body temperature", reads: [["Temperature", "°C"]], action: "Scan temperature" },
];

function Btn({ children, primary }: { children: string; primary?: boolean }) {
  return (
    <button disabled title="Device offline" className={`rounded-sm px-3.5 py-2 text-[12.5px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${primary ? "bg-primary text-primary-foreground" : "border text-foreground"}`}>
      {children}
    </button>
  );
}

function Sensors() {
  return (
    <>
      <PageHead
        eyebrow="Live sensors"
        title={<>Instruments, <em>at rest.</em></>}
        aside={<div className="flex gap-2"><Btn primary>Start full scan</Btn><Btn>Stop scan</Btn></div>}
      />
      <Offline>The ESP32 isn't reachable. Readings will appear here as soon as the device connects — nothing is shown until then.</Offline>
      <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
        {modules.map((m, i) => (
          <Reveal key={m.name} delay={i * 120} className="bg-background"><Spotlight className="h-full">
          <section className="p-0 md:p-8 py-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="eyebrow">{m.role}</div>
                <h2 className="mt-1.5 font-display text-[30px] leading-none">{m.name}</h2>
              </div>
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><StatusDot tone="off" />Not connected</span>
            </div>
            <div className="mt-10 flex gap-12">
              {m.reads.map(([l, u]) => (
                <div key={l}>
                  <div className="eyebrow">{l}</div>
                  <div className="mt-2 flex items-baseline gap-1.5"><span className="num text-[44px] font-medium leading-none text-muted-foreground/60">--</span><span className="text-[12px] text-muted-foreground">{u}</span></div>
                </div>
              ))}
            </div>
            <div className="rule mt-10 flex items-center justify-between pt-4">
              <span className="num text-[12px] text-muted-foreground">Last updated · never</span>
              <Btn>{m.action}</Btn>
            </div>
          </section>
          </Spotlight></Reveal>
        ))}
      </div>
    </>
  );
}
