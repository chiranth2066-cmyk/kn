import { createFileRoute } from "@tanstack/react-router";
import { RotateCw } from "lucide-react";
import { PageHead } from "@/components/AppShell";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Reading history — Vesper" },
      { name: "description", content: "Every saved heart rate, SpO₂ and temperature reading." },
      { property: "og:title", content: "Reading history — Vesper" },
      { property: "og:description", content: "A precise record of your saved health readings." },
    ],
  }),
  component: History,
});

function History() {
  return (
    <>
      <PageHead
        eyebrow="Reading history"
        title={<>The <em>record.</em></>}
        aside={
          <div className="flex items-center gap-3">
            <input type="date" aria-label="Filter by date" className="num rounded-sm border bg-surface px-3 py-2 text-[12.5px]" />
            <button disabled className="flex items-center gap-1.5 rounded-sm border px-3 py-2 text-[12.5px] font-semibold disabled:opacity-40"><RotateCw className="size-3.5" />Refresh</button>
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[13.5px]">
          <thead>
            <tr className="border-b">
              {["Recorded", "Heart rate", "SpO₂", "Temperature"].map((h, i) => (
                <th key={h} className={`eyebrow pb-3 font-semibold ${i ? "text-right" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="py-20 text-center">
                <p className="display-md">No readings yet.</p>
                <p className="mt-3 text-muted-foreground">Saved readings will appear here once your history is connected.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
