/**
 * SkillsSection — "Liquid Precision" Design System
 * Skills with animated progress bars triggered on scroll entry.
 * Theme-aware via useTokens().
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTokens } from "@/lib/theme-tokens";

const skillCategories = [
  {
    category: "Code",
    skills: [
      { name: "C#", level: 85, label: "Advanced" },
      { name: "C", level: 72, label: "Proficient" },
      { name: "C++", level: 68, label: "Intermediate" },
      { name: "Javascript", level: 65, label: "Proficient" },
      { name: "Java", level: 56, label: "Intermediate" },
      { name: "HLSL", level: 78, label: "Advanced" },
      { name: "GLSL", level: 68, label: "Intermediate" },
    ],
  },
  {
    category: "Design",
    skills: [
      { name: "Prototyping", level: 92, label: "Expert" },
      { name: "Design Systems", level: 73, label: "Proficient" },
      { name: "UX Research", level: 60, label: "Intermediate" },
      { name: "Gen AI", level: 72, label: "Proficient" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Unity", level: 89, label: "Advanced" },
      { name: "Blender", level: 80, label: "Advanced" },
      { name: "Gimp", level: 78, label: "Proficient" },
      { name: "Autodesk Fusion", level: 51, label: "Intermediate" },
      { name: "Figma", level: 50, label: "Intermediate" },
      { name: "VS Code / Pro", level: 73, label: "Proficient" },
      { name: "FL Studio", level: 50, label: "Intermediate" },
      { name: "DaVinci Resolve", level: 66, label: "Intermediate" },
      { name: "Audacity", level: 60, label: "Intermediate" },
    ],
  },
  {
    category: "Maker Skills",
    skills: [
      { name: "Laser Cutting / CNC", level: 50, label: "Intermediate" },
      { name: "Electronics / PCB", level: 66, label: "Intermediate" },
      { name: "Arduino / Hardware", level: 70, label: "Proficient" },
      { name: "3D Printing", level: 81, label: "Advanced" },
      { name: "Papier-mâché", level: 86, label: "Advanced" },
      { name: "Woodworking", level: 77, label: "Proficient" },
    ],
  },
];

function SkillBar({ name, level, label, delay }: { name: string; level: number; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const t = useTokens();

  return (
    <div ref={ref} className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem", color: t.textSecondary }}>
          {name}
        </span>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDim }}>
            {label}
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: t.mint }}>
            {level}%
          </span>
        </div>
      </div>
      <div style={{ height: "3px", background: t.surface2, borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.0, delay, ease: "easeOut" }}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${t.mint}, ${t.violet})`,
            borderRadius: "2px",
            boxShadow: `0 0 8px ${t.mint}66`,
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTokens();

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: t.surface }}
    >
      <span className="section-number" style={{ left: "-1rem", top: "2rem", color: t.sectionNumber }}>
        03
      </span>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="accent-line" style={{ background: t.mint }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.mint }}>
            Skills
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1,
            letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "3rem",
          }}
        >
          Capabilities &{" "}
          <span className="text-gradient">Proficiency</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {skillCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + catIdx * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: t.violet }}>
                  {String(catIdx + 1).padStart(2, "0")}
                </span>
                <span style={{ width: "1.5rem", height: "1px", background: `${t.violet}80`, display: "block" }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.05em", color: t.textSecondary }}>
                  {cat.category}
                </span>
              </div>
              {cat.skills.map((skill, skillIdx) => (
                <SkillBar key={skill.name} {...skill} delay={0.2 + catIdx * 0.05 + skillIdx * 0.07} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
