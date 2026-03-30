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
    category: "Design",
    skills: [
      { name: "Prototyping", level: 92, label: "Expert" },
      { name: "Design Systems", level: 85, label: "Advanced" },
      { name: "UX Research", level: 60, label: "Intermediate" },
      { name: "Motion Design", level: 72, label: "Proficient" },
      { name: "Figma", level: 50, label: "Intermediate" },
    ],
  },
  {
    category: "Engineering",
    skills: [
      { name: "Arduino / Hardware", level: 88, label: "Advanced" },
      { name: "React / TypeScript", level: 82, label: "Advanced" },
      { name: "3D Printing / CAD", level: 90, label: "Expert" },
      { name: "Python", level: 75, label: "Proficient" },
      { name: "WebGL / Shaders", level: 60, label: "Intermediate" },
    ],
  },
  {
    category: "Tools & Methods",
    skills: [
      { name: "Rapid Prototyping", level: 96, label: "Expert" },
      { name: "User Testing", level: 80, label: "Advanced" },
      { name: "Laser Cutting / CNC", level: 85, label: "Advanced" },
      { name: "Electronics / PCB", level: 70, label: "Proficient" },
      { name: "Agile / Scrum", level: 78, label: "Advanced" },
    ],
  },
  {
    category: "Creative Tech",
    skills: [
      { name: "TouchDesigner", level: 65, label: "Intermediate" },
      { name: "Processing / p5.js", level: 72, label: "Proficient" },
      { name: "Unity / C#", level: 58, label: "Intermediate" },
      { name: "Blender", level: 68, label: "Proficient" },
      { name: "Raspberry Pi", level: 82, label: "Advanced" },
    ],
  },
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
