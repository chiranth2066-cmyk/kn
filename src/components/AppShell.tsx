import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Activity, Clock, History, Menu, Mic, Pill, Settings, X, LayoutGrid } from "lucide-react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/voice", label: "Voice assistant", icon: Mic },
  { to: "/sensors", label: "Live sensors", icon: Activity },
  { to: "/reminders", label: "Medicine", icon: Pill },
  { to: "/history", label: "Reading history", icon: History },
  { to: "/conversations", label: "Conversations", icon: Clock },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function StatusDot({ tone }: { tone: "ok" | "off" | "warn" | "live" }) {
  const cls = { ok: "bg-primary", off: "bg-border", warn: "bg-warning", live: "bg-primary animate-breathe" }[tone];
  return <span className={`inline-block size-1.5 rounded-full ${cls}`} aria-hidden />;
}

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-7 pb-10">
        <div className="font-display text-[26px] leading-none tracking-tight">Vesper</div>
        <div className="eyebrow mt-2">Health companion</div>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            className="group relative flex items-center gap-3 rounded-sm px-3 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground data-[status=active]:bg-surface data-[status=active]:text-foreground"
          >
            <Icon className="size-[15px] stroke-[1.6]" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-2.5 px-6 pb-7 text-[12px] text-muted-foreground">
        <div className="eyebrow mb-3">Connections</div>
        <div className="flex items-center justify-between"><span>ESP32 device</span><span className="flex items-center gap-1.5"><StatusDot tone="off" />Offline</span></div>
        <div className="flex items-center justify-between"><span>Voice service</span><span className="flex items-center gap-1.5"><StatusDot tone="off" />Not linked</span></div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-[216px] border-r lg:block">
        <NavBody />
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background px-5 py-3.5 lg:hidden">
        <span className="font-display text-2xl leading-none">Vesper</span>
        <button aria-label="Open navigation" onClick={() => setOpen(true)} className="p-1.5"><Menu className="size-5 stroke-[1.6]" /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <button aria-label="Close navigation" onClick={() => setOpen(false)} className="absolute top-3.5 right-5 p-1.5"><X className="size-5 stroke-[1.6]" /></button>
          <NavBody onNavigate={() => setOpen(false)} />
        </div>
      )}
      <main className="lg:pl-[216px]">
        <div className="mx-auto max-w-[1180px] px-5 pt-10 pb-20 sm:px-10 lg:px-14 lg:pt-14">{children}</div>
      </main>
    </div>
  );
}

export function PageHead({ eyebrow, title, lede, aside }: { eyebrow: string; title: ReactNode; lede?: string; aside?: ReactNode }) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <div className="eyebrow mb-5">{eyebrow}</div>
        <h1 className="display-xl">{title}</h1>
        {lede && <p className="mt-4 max-w-md text-[15px] text-muted-foreground">{lede}</p>}
      </div>
      {aside}
    </div>
  );
}

export function Offline({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-warning bg-surface px-4 py-3 text-[13px] text-muted-foreground">
      <span className="eyebrow mt-0.5 shrink-0 text-warning">Offline</span>
      <span>{children}</span>
    </div>
  );
}
