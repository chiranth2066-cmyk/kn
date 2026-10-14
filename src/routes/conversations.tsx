import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { Reveal } from "@/components/Motion";
import { MessageSquare, Mic, Search, ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/conversations")({
  head: () => ({
    meta: [
      { title: "Conversations — Vesper" },
      {
        name: "description",
        content: "Archived voice transcripts and consultations with your health companion.",
      },
      { property: "og:title", content: "Conversations — Vesper" },
      {
        property: "og:description",
        content: "Archived consultations with your health companion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Conversations,
});

function Conversations() {
  return (
    <div className="max-w-3xl space-y-10">
      <PageHead
        eyebrow="Consultation Archive"
        title={
          <>
            What we <em>talked about.</em>
          </>
        }
        lede="Past voice sessions, symptoms discussed, and recommendations indexed securely on your local device."
        aside={
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-surface px-3 py-1.5 shadow-2xs">
            <Search className="size-3.5 stroke-[1.8] text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transcript history…"
              className="bg-transparent text-[12.5px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        }
      />

      <Reveal delay={120}>
        <div className="rounded-xl border border-border/80 bg-surface/90 p-8 shadow-[0_2px_14px_rgba(0,0,0,0.02)] sm:p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-border/80 bg-surface-subtle text-primary">
            <MessageSquare className="size-6 stroke-[1.5]" />
          </div>

          <h3 className="display-sm mt-5 font-normal text-foreground">
            No consultations recorded yet.
          </h3>
          <p className="mx-auto mt-2.5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
            When you complete a voice session, a structured transcript with clinical
            keywords and timestamps will be saved here in local hardware storage.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/voice"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover active:scale-98"
            >
              <Mic className="size-3.5 stroke-[2]" />
              <span>Start voice consultation</span>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 border-t border-border-subtle pt-6 text-[11px] text-muted-foreground">
            <Lock className="size-3 text-emerald-800" />
            <span>End-to-end encrypted · Stored only on your device storage</span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

