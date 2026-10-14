import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { VoiceWorkspace } from "@/components/Voice";
import { MetricStrip } from "@/components/Metrics";
import { BlurText, Reveal } from "@/components/Motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Vesper Health Companion" },
      { name: "description", content: "Your voice-first health companion: vitals, reminders and conversation in one calm place." },
      { property: "og:title", content: "Overview — Vesper Health Companion" },
      { property: "og:description", content: "Voice-first health companion for heart rate, SpO₂, temperature and medicine reminders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening.";
}

function Index() {
  return (
    <>
      <PageHead
        eyebrow={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        title={<span suppressHydrationWarning><BlurText text={greeting()} /></span>}
        lede="Your health companion is here."
      />
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Reveal delay={300}><VoiceWorkspace compact /></Reveal>
        <Reveal delay={420}><aside className="space-y-10">
          <div>
            <div className="flex items-baseline justify-between"><h2 className="text-[15px] font-semibold">Vitals</h2><Link to="/sensors" className="text-[12px] text-muted-foreground hover:text-foreground">Sensors →</Link></div>
            <div className="rule mt-3"><MetricStrip vertical /></div>
          </div>
          <div>
            <div className="flex items-baseline justify-between"><h2 className="text-[15px] font-semibold">Today's medicine</h2><Link to="/reminders" className="text-[12px] text-muted-foreground hover:text-foreground">Edit →</Link></div>
            <ul className="rule mt-3 divide-y text-[13px]">
              {["Morning", "Afternoon", "Evening"].map((p) => (
                <li key={p} className="flex justify-between py-3"><span>{p}</span><span className="num text-muted-foreground">Not set</span></li>
              ))}
            </ul>
          </div>
        </aside></Reveal>
      </div>
      <p className="mt-16 max-w-lg text-[12px] text-muted-foreground">Vesper is informational and not a medical diagnosis. Speak to a clinician about any concern.</p>
    </>
  );
}
