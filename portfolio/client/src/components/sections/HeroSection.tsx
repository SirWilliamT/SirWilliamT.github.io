/**
 * HeroSection — "Liquid Precision" Design System
 * Full-viewport hero: left-aligned display type, WebGL shader on right.
 * Theme-aware via useTokens(). Shader stays dark in both modes.
 */

import { motion } from "framer-motion";
import ShaderCanvas from "../ShaderCanvas";
import ScrambleText from "../ScrambleText";
import { useTokens } from "@/lib/theme-tokens";
import { useTheme } from "@/contexts/ThemeContext";

const SCRAMBLE_TITLES = [
  "Prototyper",
  "Creative Technologist",
  "Technical Designer",
  "Software Engineer",
  "Game Developer",
  "XR Specialist",
  "Technical Artist",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function HeroSection() {
  const t = useTokens();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  // In light mode, the shader is still dark — use a stronger overlay to blend it into the light bg
  const overlayGradient = isDark
    ? "linear-gradient(100deg, oklch(0.09 0.018 240 / 0.97) 0%, oklch(0.09 0.018 240 / 0.90) 30%, oklch(0.09 0.018 240 / 0.50) 55%, oklch(0.09 0.018 240 / 0.10) 75%, transparent 100%)"
    : "linear-gradient(100deg, oklch(0.97 0.006 240 / 0.97) 0%, oklch(0.97 0.006 240 / 0.90) 30%, oklch(0.97 0.006 240 / 0.60) 55%, oklch(0.97 0.006 240 / 0.20) 75%, transparent 100%)";

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* WebGL Shader — always dark, full opacity */}
      <div className="absolute inset-0 z-0">
        <ShaderCanvas className="w-full h-full" isDark={isDark} />
      </div>

      {/* Left-side text legibility gradient */}
      <div className="absolute inset-0 z-[1]" style={{ background: overlayGradient }} />

      {/* Content */}
      <div className="container relative z-[10] pt-24 pb-16">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl">

          {/* Label */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <span className="accent-line" style={{ background: t.mint }} />
            <ScrambleText
              titles={SCRAMBLE_TITLES}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: t.mint,
              }}
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: isDark ? "oklch(0.92 0.008 220)" : "oklch(0.12 0.02 240)",
              marginBottom: "0.15em",
            }}
          >
            William
          </motion.h1>

          {/* Tagline */}
          <motion.h2
            variants={itemVariants}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            <span style={{ color: t.textSecondary }}>Bridging </span>
            <span className="text-gradient">
              design & engineering
            </span>
            <span style={{ color: t.textSecondary }}> through</span>
            <br />
            <span style={{ color: isDark ? "oklch(0.92 0.008 220)" : "oklch(0.12 0.02 240)" }}>rapid prototyping</span>
            <span style={{ color: t.textSecondary }}> & creative technology.</span>
          </motion.h2>

          {/* Bio snippet */}
          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
              lineHeight: 1.7,
              color: t.textSecondary,
              maxWidth: "480px",
              marginBottom: "2.5rem",
            }}
          >
            I turn ideas into tangible experiences — from early-stage concept prototypes
            to production-ready interactive systems. Currently open to new opportunities.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
              className="mint-glow"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isDark ? "oklch(0.09 0.018 240)" : "oklch(0.97 0.006 240)",
                background: t.mint,
                border: "none",
                padding: "0.875rem 2rem",
                borderRadius: "2px",
                cursor: "none",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = "0.9";
                (e.target as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = "1";
                (e.target as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              View Work
            </button>

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: t.mint,
                background: "transparent",
                border: `1px solid ${t.mintDim}`,
                padding: "0.875rem 2rem",
                borderRadius: "2px",
                cursor: "none",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement;
                el.style.borderColor = t.mint;
                el.style.background = `${t.mint}0D`;
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement;
                el.style.borderColor = t.mintDim;
                el.style.background = "transparent";
              }}
            >
              Get In Touch
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2"
        style={{ cursor: "none" }}
        aria-label="Scroll down"
      >
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: t.textDim,
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "32px",
            background: `linear-gradient(to bottom, ${t.mint}, transparent)`,
          }}
        />
      </motion.button>
    </section>
  );
}
