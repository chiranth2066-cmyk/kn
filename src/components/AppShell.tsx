import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import {
  Activity,
  Clock,
  History,
  Menu,
  Mic,
  Pill,
  Settings,
  X,
  LayoutGrid,
  Radio,
  Cpu,
  ShieldCheck,
  Moon,
  Sun,
} from "lucide-react";
import { Reveal } from "./Motion";
import { GlassLayer, LiquidGlass } from "./LiquidGlass";
import { Button } from "./ui/button";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  badge?: string;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Core",
    items: [
      { to: "/", label: "Overview", icon: LayoutGrid },
      { to: "/voice", label: "Voice assistant", icon: Mic },
    ],
  },
  {
    label: "Diagnostics",
    items: [
      { to: "/sensors", label: "Live sensors", icon: Activity },
      { to: "/history", label: "Reading history", icon: History },
    ],
  },
  {
    label: "Regimen",
    items: [
      { to: "/reminders", label: "Medicine", icon: Pill },
      { to: "/conversations", label: "Conversations", icon: Clock },
    ],
  },
  {
    label: "System",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
];

export function StatusDot({
  tone,
  className = "",
}: {
  tone: "ok" | "off" | "warn" | "live";
  className?: string;
}) {
  const styles = {
    ok: "bg-emerald-600 ring-emerald-600/20",
    off: "bg-stone-300 ring-stone-300/30",
    warn: "bg-amber-600 ring-amber-600/20",
    live: "bg-emerald-600 ring-emerald-600/30 animate-breathe",
  }[tone];

  return (
    <span
      className={`relative inline-flex size-2 rounded-full ring-2 ${styles} ${className}`}
      aria-hidden
    />
  );
}

function NavBody({
  onNavigate,
  darkMode,
  toggleDarkMode,
}: {
  onNavigate?: () => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}) {
  const location = useLocation();

  return (
    <div data-liquid-ignore className="glass-content flex h-full flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="px-6 pt-8 pb-7">
          <Link
            to="/"
            onClick={onNavigate}
            className="group flex flex-col focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-[28px] tracking-tight text-foreground transition-colors group-hover:text-primary">
                Vesper
              </span>
              <span className="size-1.5 rounded-full bg-primary/80" aria-hidden />
            </div>
            <div className="eyebrow mt-1.5 flex items-center gap-2 text-[9.5px] tracking-[0.16em]">
              <span>Health companion</span>
              <span className="text-border">/</span>
              <span className="num text-muted-foreground/80">v2.4</span>
            </div>
          </Link>
        </div>

        {/* Grouped Navigation */}
        <nav className="flex flex-col gap-6 px-3">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <div className="px-3 pb-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                {section.label}
              </div>
              {section.items.map(({ to, label, icon: Icon, badge }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onNavigate}
                    activeOptions={{ exact: true }}
                    className={`group relative flex items-center justify-between rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)] font-semibold"
                        : "text-muted-foreground hover:bg-surface/50 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`size-4 stroke-[1.5] transition-colors ${
                          isActive
                            ? "text-primary stroke-[1.8]"
                            : "text-muted-foreground/80 group-hover:text-foreground"
                        }`}
                      />
                      <span>{label}</span>
                    </div>
                    {isActive ? (
                      <span className="size-1 rounded-full bg-primary" aria-hidden />
                    ) : badge ? (
                      <span className="num rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Telemetry & Device Status Footer */}
      <div className="mt-8 border-t border-border-subtle p-5">
        <div className="rounded-md border border-border/70 bg-surface/80 p-3.5 backdrop-blur-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            <span className="flex items-center gap-1.5">
              <Cpu className="size-3 stroke-[1.8] text-muted-foreground/90" />
              Hardware link
            </span>
            <span className="num text-[10px] text-muted-foreground/70">I²C · 400k</span>
          </div>

          <div className="mt-2.5 space-y-2 text-[11.5px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ESP32-S3 Module</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <StatusDot tone="off" />
                <span className="text-[11px] text-muted-foreground">Standby</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Audio Pipeline</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <StatusDot tone="ok" />
                <span className="text-[11px] text-muted-foreground">WebAudio</span>
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2.5 text-[10.5px] text-muted-foreground/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-700/80" />
              Local processing
            </span>
            <span className="num font-mono text-[9.5px]">SECURE</span>
          </div>

          {/* Dark / Light Luxury Edition Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="mt-3 flex w-full items-center justify-between rounded-md border border-border/80 bg-background/60 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            title="Toggle between Warm Porcelain and Midnight Charcoal"
          >
            <span className="flex items-center gap-1.5">
              {darkMode ? (
                <Sun className="size-3 text-amber-500" />
              ) : (
                <Moon className="size-3 text-primary" />
              )}
              <span>{darkMode ? "Warm Porcelain" : "Midnight Charcoal"}</span>
            </span>
            <span className="num font-mono text-[9px] uppercase">
              {darkMode ? "LIGHT" : "DARK"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    const isDark = localStorage.getItem("vesper_theme") === "dark";
    if (isDark) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("vesper_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("vesper_theme", "light");
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-accent selection:text-foreground">
      <LiquidGlass pageKey={`${pathname}:${open}:${darkMode}`} />

      {/* Desktop Fixed Left Rail */}
      <aside className="glass-host fixed inset-y-0 left-0 z-20 hidden w-[240px] border-r border-border/80 bg-background/95 backdrop-blur-md lg:block">
        <GlassLayer />
        <NavBody darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </aside>

      {/* Mobile Sticky Header */}
      <header className="glass-host sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-background/95 px-5 py-3.5 backdrop-blur-md lg:hidden">
        <GlassLayer />
        <Link
          to="/"
          data-liquid-ignore
          className="glass-content flex items-center gap-2 focus:outline-none"
        >
          <span className="font-display text-2xl tracking-tight text-foreground">
            Vesper
          </span>
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
        </Link>
        <div data-liquid-ignore className="glass-content flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={toggleDarkMode}
            className="h-8 w-8 rounded-md border border-border/60 bg-surface p-0 text-foreground"
          >
            {darkMode ? (
              <Sun className="size-3.5 text-amber-500" />
            ) : (
              <Moon className="size-3.5 text-primary" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
            className="h-8 rounded-md border border-border/60 bg-surface px-2.5 text-foreground hover:bg-surface-subtle"
          >
            <Menu className="size-4 stroke-[1.6]" />
            <span className="ml-1.5 text-xs font-medium">Menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex w-[280px] flex-col bg-background shadow-2xl">
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-md border border-border/60 p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4 stroke-[1.6]" />
            </button>
            <NavBody
              onNavigate={() => setOpen(false)}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="lg:pl-[240px]">
        <div className="mx-auto max-w-[1220px] px-5 pt-8 pb-24 sm:px-8 lg:px-12 lg:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHead({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between lg:mb-12">
      <div className="max-w-2xl">
        <Reveal>
          <div className="mb-3.5 flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-primary/70" />
            <span suppressHydrationWarning className="eyebrow">{eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display-xl text-foreground font-normal">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={160}>
            <p className="mt-3.5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
      {aside && (
        <Reveal delay={220} className="shrink-0">
          {aside}
        </Reveal>
      )}
    </div>
  );
}

export function Offline({ children }: { children: ReactNode }) {
  return (
    <div className="glass-host relative overflow-hidden rounded-md border border-amber-600/30 bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <GlassLayer />
      <div
        data-liquid-ignore
        className="glass-content flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-700">
            <Radio className="size-3 stroke-[2] text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-amber-800 uppercase">
                TELEMETRY OFFLINE
              </span>
              <span className="size-1 rounded-full bg-amber-600/40" />
              <span className="text-[11.5px] text-muted-foreground">Hardware Standby</span>
            </div>
            <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground/90">
              {children}
            </p>
          </div>
        </div>
        <div className="shrink-0 self-end sm:self-center">
          <span className="num font-mono text-[11px] text-muted-foreground/80">
            Awaiting 192.168.x.x
          </span>
        </div>
      </div>
    </div>
  );
}

