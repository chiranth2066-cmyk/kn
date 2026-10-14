import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/AppShell";
import { VoiceWorkspace } from "@/components/Voice";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Voice assistant — Vesper" },
      { name: "description", content: "Talk naturally with your health companion." },
      { property: "og:title", content: "Voice assistant — Vesper" },
      { property: "og:description", content: "Talk naturally with your health companion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div className="max-w-3xl">
      <PageHead eyebrow="Voice assistant" title={<>A quiet <em>conversation.</em></>} />
      <VoiceWorkspace />
    </div>
  ),
});
