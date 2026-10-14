import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { GlassLayer } from "./LiquidGlass";

/** Scroll Reveal: fades/lifts children when they enter the viewport. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-shown={shown} style={{ transitionDelay: `${delay}ms` } as CSSProperties} className={`motion-reveal ${className}`}>
      {children}
    </div>
  );
}

/** Blur Text: staggered per-word blur-in for headings. */
export function BlurText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="motion-word" style={{ animationDelay: `${i * 90}ms` }}>
          {w}{" "}
        </span>
      ))}
    </span>
  );
}

/** Spotlight: cursor-following soft light on a surface. */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`glass-host motion-spotlight ${className}`}
    >
      <GlassLayer />
      <div className="glass-content">{children}</div>
    </div>
  );
}
