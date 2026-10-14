import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Offline, PageHead } from "@/components/AppShell";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Medicine reminders — Vesper" },
      { name: "description", content: "Morning, afternoon and evening medicine reminders with voice and LED alerts." },
      { property: "og:title", content: "Medicine reminders — Vesper" },
      { property: "og:description", content: "A calm, precise medicine schedule." },
    ],
  }),
  component: Reminders,
});

const periods = ["Morning", "Afternoon", "Evening"] as const;

function Reminders() {
  const [times, setTimes] = useState<Record<string, string>>({ Morning: "08:00", Afternoon: "13:00", Evening: "20:00" });
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <div className="max-w-3xl">
      <PageHead eyebrow="Medicine" title={<>Three moments <em>a day.</em></>} lede="Set when you'd like to be reminded. Vesper will speak and your device will light up." />
      <ul className="rule divide-y border-b">
        {periods.map((p, i) => (
          <li key={p} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[3rem_10rem_1fr_auto]">
            <span className="num text-[12px] text-muted-foreground">0{i + 1}</span>
            <span className="text-[15px] font-semibold">{p}</span>
            {editing === p ? (
              <input type="time" autoFocus value={times[p]} onChange={(e) => setTimes({ ...times, [p]: e.target.value })} onBlur={() => setEditing(null)} className="num col-span-3 w-32 border-b border-primary bg-transparent py-1 text-[28px] font-medium outline-none sm:col-span-1" />
            ) : (
              <span className="num col-span-3 order-last text-[28px] font-medium leading-none sm:order-none sm:col-span-1">{times[p]} <span className="ml-2 align-middle text-[11px] font-medium text-muted-foreground">Not saved to device</span></span>
            )}
            <button onClick={() => setEditing(p)} className="text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground">Edit</button>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        <button disabled className="rounded-sm bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground disabled:opacity-40">Save reminder times</button>
        <button disabled className="rounded-sm border px-4 py-2.5 text-[13px] font-semibold disabled:opacity-40">Test voice & LED</button>
      </div>
      <div className="mt-6"><Offline>Saving and testing need the ESP32 and voice service. You can also set times by saying, "Remind me at eight in the morning."</Offline></div>
    </div>
  );
}
