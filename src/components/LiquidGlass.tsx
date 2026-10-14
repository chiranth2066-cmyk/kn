import { useEffect } from "react";
import type { LiquidLens } from "liquid-gl";

/** Decorative lens only: real text, inputs and hit targets remain untouched. */
export function GlassLayer() {
  return <div className="glass-layer" data-glass-lens aria-hidden="true" />;
}

export function LiquidGlass({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    let cancelled = false;
    let lenses: LiquidLens[] = [];
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;

    function teardown() {
      lenses.forEach((lens) => {
        lens.el.removeAttribute("data-glass-ready");
        lens.destroy();
      });
      lenses = [];
      document.querySelectorAll("[data-glass-active]").forEach((el) => el.removeAttribute("data-glass-active"));
    }

    async function initialize() {
      try {
        const { default: liquidGL } = await import("liquid-gl");
        await document.fonts.ready;
        if (cancelled) return;
        teardown();
        const visible = Array.from(document.querySelectorAll<HTMLElement>("[data-glass-lens]"))
          .filter((el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0);
        visible.forEach((el) => el.setAttribute("data-glass-active", ""));
        if (visible.length === 0) return;
        const result = liquidGL({
          target: "[data-glass-active]",
          snapshot: "body",
          // Never rasterize or replace the application's interactive content.
          content: false,
          resolution: Math.min(window.devicePixelRatio || 1, 1.5),
          refraction: 0.008,
          aberration: 0.025,
          bevelDepth: 0.035,
          bevelWidth: 0.12,
          frost: 1.5,
          shadow: false,
          specular: !reducedMotion.matches,
          reveal: "none",
          tilt: false,
          interaction: reducedMotion.matches ? "none" : "fluid",
          interactionStrength: 0.12,
          on: { init: (lens) => {
            if (!cancelled) lens.el.setAttribute("data-glass-ready", "true");
          } },
        });
        lenses = result ? (Array.isArray(result) ? result : [result]) : [];
      } catch (error) {
        teardown();
        console.warn("Vesper glass unavailable; retaining original surfaces.", error);
      }
    }

    function schedule() {
      clearTimeout(timer);
      teardown();
      // Let existing heading and reveal animations settle before the snapshot.
      timer = setTimeout(() => { void initialize(); }, 1100);
    }
    schedule();
    desktop.addEventListener("change", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      desktop.removeEventListener("change", schedule);
      reducedMotion.removeEventListener("change", schedule);
      teardown();
    };
  }, [pageKey]);
  return null;
}