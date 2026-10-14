import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Vesper" },
      { name: "description", content: "Device and voice service settings." },
      { property: "og:title", content: "Settings — Vesper" },
      { property: "og:description", content: "Device and voice service settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

const fields = [
  ["ESP32 device address", "e.g. http://192.168.1.40"],
  ["Voice service address", "e.g. http://localhost:5000"],
];

function Settings() {
  return (
    <div className="max-w-2xl">
      <PageHead eyebrow="Settings" title={<>Connections.</>} lede="Where Vesper finds your device and voice service." />
      <div className="rule divide-y border-b">
        {fields.map(([l, p]) => (
          <label key={l} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:items-center">
            <span className="text-[13.5px] font-semibold">{l}</span>
            <input placeholder={p} className="num border-b bg-transparent py-1.5 text-[14px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary" />
          </label>
        ))}
      </div>
      <p className="mt-6 text-[12px] text-muted-foreground">Linking these addresses comes in the next step.</p>
    </div>
  );
}
