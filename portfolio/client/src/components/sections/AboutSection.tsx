/**
 * AboutSection — "Liquid Precision" Design System
 * About section with large section number, two-column layout,
 * and Framer Motion scroll-triggered reveal. Theme-aware via useTokens().
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTokens } from "@/lib/theme-tokens";

const stats = [
  { value: "23+",  label: "Years Experience" },
  { value: "20+", label: "Prototypes Shipped" },
  { value: "12+", label: "Tools Mastered" },
  { value: "6+",   label: "Games Shipped" },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTokens();

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: t.bg }}
    >
      {/* Subtle texture background on right side */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663345543862/MCwaty8ucFe7SL9bztwDea/about-texture-TGNMZ47WMLjNo8fTmur4aX.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
          maskImage: "linear-gradient(to left, rgba(0,0,0,0.6), transparent)",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.6), transparent)",
        }}
      />

      {/* Section number watermark */}
      <span className="section-number" style={{ right: "-2rem", top: "2rem", color: t.sectionNumber }}>
        03
      </span>

      <div className="container">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="accent-line" style={{ background: t.mint }} />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: t.mint,
          }}>
            About
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: t.textPrimary,
                marginBottom: "1.5rem",
              }}
            >
              Crafting experiences
              <br />
              <span className="text-gradient">
                at the intersection
              </span>
              <br />
              of form and function.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: t.textSecondary,
                marginBottom: "1.25rem",
              }}
            >
              I'm William — a Product Design Prototyper and Creative Technologist with a
              passion for turning abstract concepts into tangible, interactive experiences.
              My work lives at the crossroads of industrial design, software engineering,
              and human-centered thinking.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: t.textSecondary,
                marginBottom: "2rem",
              }}
            >
              From early-stage concept sketches and rapid hardware prototypes to
              high-fidelity interactive demos, I bridge the gap between what designers
              envision and what engineers build. I believe the best prototypes are the
              ones that ask better questions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.mint,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                className="hover-underline"
              >
                Let's collaborate <span style={{ fontSize: "1rem" }}>→</span>
              </button>
            </motion.div>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-px" style={{ border: `1px solid ${t.border}` }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="p-8"
                style={{
                  background: t.surface,
                  borderRight: i % 2 === 0 ? `1px solid ${t.border}` : "none",
                  borderBottom: i < 2 ? `1px solid ${t.border}` : "none",
                }}
              >
                <div className="text-gradient" style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: t.textDim,
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
