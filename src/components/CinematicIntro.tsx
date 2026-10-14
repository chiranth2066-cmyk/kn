import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Magnetic, EASE_CINEMATIC, EASE_CURTAIN } from "./Motion";

interface CinematicIntroProps {
  onEnter?: () => void;
  forceShow?: boolean;
}

export function CinematicIntro({ onEnter, forceShow = false }: CinematicIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsVisible(true);
    setIsExiting(false);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [forceShow]);

  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (shouldReduceMotion) {
      setIsVisible(false);
      setIsExiting(false);
      document.body.style.overflow = "";
      onEnter?.();
      return;
    }

    // Coordinated exit duration (approx 1250ms)
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      document.body.style.overflow = "";
      onEnter?.();
    }, 1250);
  }, [isExiting, shouldReduceMotion, onEnter]);

  // Keyboard accessibility
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleEnter]);

  if (isVisible === null || !isVisible) return null;

  const headlineLine1 = ["A", "quiet", "study", "in"];
  const headlineLine2 = ["vital", "precision."];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="cinematic-curtain"
        initial={{ y: "0%" }}
        animate={
          isExiting
            ? {
                y: "-100%",
                transition: { duration: 1.15, ease: EASE_CURTAIN },
              }
            : { y: "0%" }
        }
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#090D0B] text-[#F3EFE6] select-none"
        style={{ pointerEvents: isExiting ? "none" : "auto" }}
      >
        {/* Layer 1: Cinematic 35mm Background Image with Parallax & Slow Drift */}
        <motion.div
          className="absolute inset-0 z-0 origin-center"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={
            isExiting
              ? {
                  scale: 1.16,
                  y: 80,
                  transition: { duration: 1.15, ease: EASE_CURTAIN },
                }
              : {
                  scale: 1.0,
                  opacity: 1,
                  transition: { duration: 1.8, ease: EASE_CINEMATIC },
                }
          }
        >
          <img
            src="/images/cinematic-intro.jpg"
            alt="Cinematic architectural study — Vesper Health Companion"
            className="size-full object-cover object-[center_35%]"
          />
        </motion.div>

        {/* Layer 2: Atmosphere Vignette & Film Light Wash */}
        <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#060908]/92 via-[#060908]/30 to-[#060908]/75" />
        <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(6,9,8,0.78)_100%)]" />

        {/* Ambient Subtle Flame Glow Pulsation over the lighter */}
        <motion.div
          className="absolute left-[34%] top-[38%] z-1 pointer-events-none size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl mix-blend-screen"
          animate={{
            opacity: [0.6, 0.9, 0.7, 1.0, 0.65],
            scale: [0.95, 1.06, 0.98, 1.1, 0.95],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle Organic 35mm Film Grain Texture */}
        <div
          className="absolute inset-0 z-1 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0)`,
            backgroundSize: "3px 3px",
          }}
        />

        {/* Top Header Rail: Brand Signature & Contextual Metadata */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={
            isExiting
              ? { opacity: 0, y: -30, transition: { duration: 0.35, ease: EASE_CINEMATIC } }
              : { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25, ease: EASE_CINEMATIC } }
          }
          className="relative z-10 flex items-center justify-between px-6 pt-7 sm:px-10 lg:px-14 lg:pt-10"
        >
          <div className="flex items-center gap-3">
            <span className="font-display text-[26px] tracking-tight text-[#FAF7F0]">
              Vesper
            </span>
            <span className="size-1 rounded-full bg-[#E5B56E]" />
            <span className="font-mono text-[9.5px] tracking-[0.22em] text-[#C2BCB0] uppercase">
              Clinical Edition
            </span>
          </div>

          <div className="hidden font-mono text-[10px] tracking-[0.2em] text-[#A6A094] uppercase sm:flex sm:items-center sm:gap-4">
            <span>ARCHIVE: 2026.10</span>
            <span className="text-[#555045]">/</span>
            <span>35MM OPTICAL STUDY</span>
            <span className="text-[#555045]">/</span>
            <span className="text-[#E5B56E]">EST. STILLNESS</span>
          </div>

          <button
            type="button"
            onClick={handleEnter}
            className="rounded-full border border-white/15 bg-black/35 px-3.5 py-1 font-mono text-[10px] tracking-widest text-[#D4CEBF] uppercase backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/60 hover:text-white"
          >
            Skip [Esc]
          </button>
        </motion.header>

        {/* Main Center/Lower Content: Split-Text Masked Headline & Narrative */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10 lg:px-14 lg:pb-16">
          <div className="max-w-3xl">
            {/* Act Eyebrow Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={
                isExiting
                  ? { opacity: 0, y: -20, transition: { duration: 0.3 } }
                  : { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35, ease: EASE_CINEMATIC } }
              }
              className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-[#D8D2C4] uppercase"
            >
              <span className="inline-block h-px w-6 bg-[#E5B56E]" />
              <span>Act I · The Architecture of Stillness</span>
            </motion.div>

            {/* Line 1: Word-by-Word Mask Reveal (inspired by ibelick/motion-primitives) */}
            <div className="overflow-hidden">
              <h1 className="font-display text-[44px] leading-[0.96] tracking-tight text-[#FAF7F0] sm:text-[64px] lg:text-[78px]">
                {headlineLine1.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden align-baseline">
                    <motion.span
                      initial={{ y: "110%", opacity: 0 }}
                      animate={
                        isExiting
                          ? { y: "-40%", opacity: 0, transition: { duration: 0.4, ease: EASE_CINEMATIC } }
                          : {
                              y: "0%",
                              opacity: 1,
                              transition: {
                                duration: 0.9,
                                delay: 0.45 + i * 0.08,
                                ease: EASE_CINEMATIC,
                              },
                            }
                      }
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>

            {/* Line 2: Italic Serif Emphasis */}
            <div className="overflow-hidden">
              <h1 className="font-display text-[44px] leading-[0.96] tracking-tight text-[#FAF7F0] sm:text-[64px] lg:text-[78px]">
                {headlineLine2.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden align-baseline">
                    <motion.span
                      initial={{ y: "110%", opacity: 0 }}
                      animate={
                        isExiting
                          ? { y: "-40%", opacity: 0, transition: { duration: 0.4, ease: EASE_CINEMATIC } }
                          : {
                              y: "0%",
                              opacity: 1,
                              transition: {
                                duration: 0.95,
                                delay: 0.75 + i * 0.1,
                                ease: EASE_CINEMATIC,
                              },
                            }
                      }
                      className="inline-block font-normal italic text-[#E5B56E]"
                    >
                      {word}&nbsp;
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>

            {/* Supporting Editorial Sentence */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={
                isExiting
                  ? { opacity: 0, y: -24, transition: { duration: 0.35 } }
                  : { opacity: 1, y: 0, transition: { duration: 0.85, delay: 0.95, ease: EASE_CINEMATIC } }
              }
              className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#C6C0B2] sm:text-[16px]"
            >
              Calibrated for physical repose, natural voice telemetry, and
              the unhurried rhythm of intelligent health instrumentation.
            </motion.p>
          </div>

          {/* Bottom Action Footer with Magnetic Button & Telemetry Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isExiting
                ? { opacity: 0, y: -16, transition: { duration: 0.3 } }
                : { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.1, ease: EASE_CINEMATIC } }
            }
            className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* The Magnetic Entrance Interaction (inspired by ibelick/motion-primitives & cult-ui) */}
            <Magnetic strength={0.28}>
              <button
                type="button"
                onClick={handleEnter}
                className="group relative inline-flex items-center gap-3.5 text-left focus:outline-none"
                aria-label="Enter Vesper health companion studio"
              >
                <div className="flex size-12 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-[#E5B56E] group-hover:bg-[#E5B56E] group-hover:text-black">
                  <ArrowUpRight className="size-4 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[13px] font-semibold tracking-[0.22em] text-[#FAF7F0] uppercase transition-colors group-hover:text-[#E5B56E]">
                    ENTER THE COMPANION
                  </span>
                  <span className="h-px w-0 bg-[#E5B56E] transition-all duration-300 group-hover:w-full" />
                </div>
              </button>
            </Magnetic>

            {/* Contextual Hardware Legend */}
            <div className="flex items-center gap-4 font-mono text-[10.5px] tracking-[0.18em] text-[#8E8779] uppercase">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500/80 animate-breathe" />
                <span>LOCAL AUDITORY ENGINE</span>
              </span>
              <span className="text-white/20">·</span>
              <span>48.0 KHZ SENSORS</span>
              <span className="text-white/20">·</span>
              <span>STANDBY</span>
            </div>
          </motion.div>
        </div>

        {/* Jose Felix Curve SVG Wipe (inspired by JoseRFelix/page-transition-tutorial) */}
        {/* An organic curved arch attached to the curtain bottom that animates during the reveal */}
        <div className="absolute top-[99.5%] left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-24 fill-[#090D0B] stroke-none block"
          >
            <path d="M0,0 L1440,0 L1440,40 Q720,120 0,40 Z" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
