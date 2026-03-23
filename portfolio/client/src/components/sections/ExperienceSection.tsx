/**
 * ExperienceSection — "Liquid Precision" Design System
 * Timeline-style experience list. Clicking an entry slides in a
 * full-height detail panel from the right with backdrop blur.
 * Theme-aware via useTokens().
 */

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTokens } from "@/lib/theme-tokens";

const experiences = [
  {
    id: "exp1",
    company: "Acme Design Studio",
    role: "Senior Product Design Prototyper",
    period: "2022 — Present",
    type: "Full-time",
    location: "San Francisco, CA",
    description:
      "Lead prototyper for a cross-functional team of 12, responsible for translating early-stage product concepts into high-fidelity interactive prototypes. Established the studio's rapid prototyping workflow, reducing concept-to-demo time by 40%.",
    responsibilities: [
      "Designed and built interactive hardware-software prototypes for 8+ product lines",
      "Established a shared Figma component library used across 3 product teams",
      "Mentored 2 junior designers in prototyping methodologies and tooling",
      "Collaborated directly with engineering to define technical feasibility constraints",
      "Presented prototypes to stakeholders and C-suite, driving product direction decisions",
    ],
    technologies: ["Figma", "Arduino", "React", "3D Printing", "Framer", "TouchDesigner"],
    color: "oklch(0.88 0.18 168)",
  },
  {
    id: "exp2",
    company: "Nexus Interactive",
    role: "Creative Technologist",
    period: "2020 — 2022",
    type: "Full-time",
    location: "New York, NY",
    description:
      "Creative technologist at an experiential design agency, building interactive installations and brand activations for Fortune 500 clients. Worked at the intersection of physical computing, real-time graphics, and spatial design.",
    responsibilities: [
      "Built 6 large-scale interactive installations for live events and brand activations",
      "Developed real-time generative visuals using TouchDesigner and Processing",
      "Integrated sensor arrays (LIDAR, depth cameras) with custom software pipelines",
      "Managed hardware procurement and on-site technical installation",
      "Collaborated with creative directors to translate briefs into technical proposals",
    ],
    technologies: ["TouchDesigner", "Arduino", "Processing", "Raspberry Pi", "Unity", "LIDAR"],
    color: "oklch(0.62 0.22 285)",
  },
  {
    id: "exp3",
    company: "Forma Labs",
    role: "UX Prototyping Intern",
    period: "2019 — 2020",
    type: "Internship",
    location: "Boston, MA",
    description:
      "Supported the UX team in creating rapid prototypes for user testing sessions. Gained foundational experience in design research, usability testing, and iterative prototyping methodologies.",
    responsibilities: [
      "Created 20+ clickthrough and interactive prototypes for user testing",
      "Assisted in conducting and synthesizing usability research sessions",
      "Contributed to the design of a new onboarding flow that improved activation by 18%",
      "Maintained and documented the team's prototyping asset library",
    ],
    technologies: ["Figma", "InVision", "Principle", "Maze", "UserTesting"],
    color: "oklch(0.75 0.15 200)",
  },
  {
    id: "exp4",
    company: "Freelance",
    role: "Independent Design Prototyper",
    period: "2018 — 2019",
    type: "Freelance",
    location: "Remote",
    description:
      "Worked with early-stage startups and independent inventors to prototype product concepts. Projects ranged from connected IoT devices to consumer app prototypes and physical product mockups.",
    responsibilities: [
      "Delivered end-to-end prototyping services for 5 startup clients",
      "Designed and fabricated physical product mockups using 3D printing and laser cutting",
      "Built functional IoT device prototypes with wireless connectivity",
      "Provided design direction and technical feasibility assessments",
    ],
    technologies: ["Fusion 360", "Arduino", "3D Printing", "Laser Cutting", "Figma"],
    color: "oklch(0.78 0.12 45)",
  },
];

function ExperiencePanel({
  experience,
  onClose,
}: {
  experience: (typeof experiences)[0];
  onClose: () => void;
}) {
  const t = useTokens();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "oklch(0.05 0.01 240 / 0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 100, cursor: "none",
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(600px, 95vw)",
          background: t.panelBg,
          borderLeft: `1px solid ${t.border}`,
          zIndex: 101, overflowY: "auto",
          padding: "3rem 2.5rem",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1.5rem", right: "1.5rem",
            background: "none", border: `1px solid ${t.border}`,
            color: t.textSecondary,
            width: "36px", height: "36px", borderRadius: "2px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", cursor: "none", transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = t.mint;
            e.currentTarget.style.borderColor = t.mintDim;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = t.textSecondary;
            e.currentTarget.style.borderColor = t.border;
          }}
          aria-label="Close panel"
        >✕</button>

        {/* Type badge */}
        <div style={{
          display: "inline-block",
          fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "oklch(0.09 0.018 240)",
          background: experience.color,
          padding: "0.25rem 0.75rem", borderRadius: "2px", marginBottom: "1.5rem",
        }}>
          {experience.type}
        </div>

        {/* Company */}
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: t.textDim, marginBottom: "0.5rem",
        }}>
          {experience.company}
        </div>

        {/* Role */}
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.1,
          letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "0.75rem",
        }}>
          {experience.role}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-4 flex-wrap" style={{ marginBottom: "2rem" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: experience.color }}>
            {experience.period}
          </span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, display: "block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: t.textDim }}>
            {experience.location}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: t.borderSubtle, marginBottom: "2rem" }} />

        {/* Description */}
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
          lineHeight: 1.8, color: t.textSecondary, marginBottom: "2rem",
        }}>
          {experience.description}
        </p>

        {/* Responsibilities */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: t.textDim, marginBottom: "1rem",
          }}>
            Key Contributions
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {experience.responsibilities.map((item, i) => (
              <li key={i} style={{
                display: "flex", gap: "0.75rem", marginBottom: "0.75rem",
                fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                lineHeight: 1.6, color: t.textSecondary,
              }}>
                <span style={{ color: experience.color, marginTop: "0.35rem", flexShrink: 0, fontSize: "0.6rem" }}>▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: t.textDim, marginBottom: "1rem",
          }}>
            Technologies
          </div>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <span key={tech} style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: experience.color,
                border: `1px solid ${experience.color}33`,
                padding: "0.3rem 0.75rem", borderRadius: "2px",
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function ExperienceSection() {
  const [selectedExp, setSelectedExp] = useState<(typeof experiences)[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTokens();

  useEffect(() => {
    document.body.style.overflow = selectedExp ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedExp]);

  return (
    <>
      <section
        id="experience"
        ref={ref}
        className="relative py-32 overflow-hidden"
        style={{ background: t.surface }}
      >
        <span className="section-number" style={{ right: "-2rem", top: "2rem", color: t.sectionNumber }}>
          02
        </span>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="accent-line" style={{ background: t.mint }} />
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
              letterSpacing: "0.2em", textTransform: "uppercase", color: t.mint,
            }}>
              Experience
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1,
              letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "0.75rem",
            }}
          >
            Where I've{" "}
            <span className="text-gradient">made an impact</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.08em", color: t.textDim, marginBottom: "3rem",
            }}
          >
            Click any role to view full details →
          </motion.p>

          <div>
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                onClick={() => setSelectedExp(exp)}
                className="group"
                style={{
                  borderTop: `1px solid ${t.borderSubtle}`,
                  padding: "1.75rem 0", cursor: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.paddingLeft = "1rem"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-6">
                    <span style={{
                      fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                      color: t.textDim, marginTop: "0.35rem", minWidth: "2rem",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: exp.color, marginBottom: "0.4rem",
                      }}>
                        {exp.company}
                      </div>
                      <h3 style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                        fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: t.textPrimary,
                        lineHeight: 1.2, marginBottom: "0.5rem", transition: "color 0.2s ease",
                      }}>
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} style={{
                            fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
                            letterSpacing: "0.08em", textTransform: "uppercase",
                            color: t.textMuted, border: `1px solid ${t.borderSubtle}`,
                            padding: "0.15rem 0.5rem", borderRadius: "2px",
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
                        color: t.textDim, marginBottom: "0.25rem",
                      }}>
                        {exp.period}
                      </div>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
                        letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDim,
                      }}>
                        {exp.type}
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      style={{ color: t.textDim, fontSize: "1.2rem", transition: "color 0.2s ease" }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: `1px solid ${t.borderSubtle}` }} />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedExp && (
          <ExperiencePanel experience={selectedExp} onClose={() => setSelectedExp(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
