import {
  useRef,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { GlassLayer } from "./LiquidGlass";

/** Shared cinematic easing curves */
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  className?: string;
  yOffset?: number;
}

/**
 * Scroll Reveal: Elegant vertical lift and opacity entrance.
 * Unified with the site's cinematic easing curve and reduced-motion compliant.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  yOffset = 16,
  ...props
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.65,
        delay: delay / 1000,
        ease: EASE_CINEMATIC,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Text Effect / BlurText:
 * Word-by-word mask reveal with subtle blur dissipation inspired by ibelick/motion-primitives.
 */
export function BlurText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline"
          aria-hidden
        >
          <motion.span
            initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.75,
              delay: delay / 1000 + i * 0.08,
              ease: EASE_CINEMATIC,
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Magnetic interaction primitive (inspired by ibelick/motion-primitives & cult-ui):
 * Subtle cursor attraction on hover for tactile actions.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * Spotlight: cursor-following soft optical light on a surface.
 */
export function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
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
      <div data-liquid-ignore className="glass-content">
        {children}
      </div>
    </div>
  );
}

