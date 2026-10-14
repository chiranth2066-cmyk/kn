import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";

export const Route = createFileRoute("/conversations")({
  head: () => ({
    meta: [
      { title: "Conversations — Vesper" },
      { name: "description", content: "Past conversations with your health companion." },
      { property: "og:title", content: "Conversations — Vesper" },
      { property: "og:description", content: "Past conversations with your health companion." },
    ],
  }),
  component: () => (
    <div className="max-w-3xl">
      <PageHead eyebrow="Conversations" title={<>What we <em>talked about.</em></>} />
      <div className="rule py-16">
        <p className="display-md text-muted-foreground">Nothing saved yet.</p>
        <p className="mt-3 text-muted-foreground">Past sessions will be listed here once conversation storage is connected.</p>
      </div>
    </div>
  ),
});
