/**
 * InterestsSection — "Liquid Precision" Design System
 * Interests/hobbies grid. Clicking a card slides in a full-height
 * detail panel from the right (same spring-animated drawer as Experience).
 * Theme-aware via useTokens().
 */

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTokens } from "@/lib/theme-tokens";

const interests = [
  {
    id: "int1", icon: "◈",
    title: "3D Printing & Fabrication",
    tagline: "Digital to physical, one layer at a time",
    description: "Turning digital designs into physical objects is one of the most satisfying loops in making. I run an FDM and resin setup for rapid prototyping, functional parts, and experimental forms — bridging the gap between screen and hand.",
    details: ["FDM printing for structural prototypes and enclosures", "Resin printing for high-detail visual models and presentation pieces", "Parametric CAD in Fusion 360 for precision mechanical parts", "Post-processing: sanding, priming, painting, and finishing", "Experimenting with flexible filaments and composite materials"],
    tags: ["FDM", "Resin", "CAD", "Fusion 360", "Post-Processing"],
    color: "oklch(0.88 0.18 168)",
  },
  {
    id: "int2", icon: "⬡",
    title: "Electronics & Making",
    tagline: "Circuits, sensors, and things that respond",
    description: "Building custom circuits and microcontroller projects is where software meets the physical world. From simple LED controllers to complex sensor arrays, I enjoy the problem-solving that comes with hardware constraints.",
    details: ["Arduino and ESP32 for embedded prototyping and IoT projects", "Custom PCB design and fabrication for cleaner final builds", "Sensor integration: IMUs, distance sensors, capacitive touch", "Wireless protocols: BLE, WiFi, MQTT for connected devices", "Soldering, enclosure design, and field-ready assembly"],
    tags: ["Arduino", "ESP32", "PCB Design", "Sensors", "BLE", "IoT"],
    color: "oklch(0.62 0.22 285)",
  },
  {
    id: "int3", icon: "◎",
    title: "Generative Art & Code",
    tagline: "Algorithms as a creative medium",
    description: "Exploring the intersection of algorithms and aesthetics. Writing generative sketches in p5.js and Processing, experimenting with shader-based visuals, and building systems that produce unexpected beauty from simple rules.",
    details: ["p5.js and Processing for 2D generative sketches and animations", "GLSL fragment shaders for real-time GPU-rendered visuals", "Noise functions, cellular automata, and L-systems", "TouchDesigner for real-time audio-reactive visuals", "Plotter art: translating generative outputs to physical drawings"],
    tags: ["p5.js", "GLSL", "Processing", "TouchDesigner", "Creative Code"],
    color: "oklch(0.75 0.15 200)",
  },
  {
    id: "int4", icon: "▦",
    title: "Industrial Design",
    tagline: "How objects are made, used, and experienced",
    description: "Studying how objects are made, used, and experienced informs every prototype I build. I follow material science, manufacturing processes, and product design case studies closely — understanding constraints makes better design.",
    details: ["Material science: properties, finishes, and manufacturing constraints", "DFM (Design for Manufacturability) principles in prototype decisions", "Ergonomics and human factors in physical product design", "Studying iconic product design case studies and design history", "Visiting manufacturing facilities and trade shows when possible"],
    tags: ["Materials", "DFM", "Ergonomics", "Manufacturing", "Product Design"],
    color: "oklch(0.78 0.12 45)",
  },
  {
    id: "int5", icon: "◉",
    title: "Photography & Visual Storytelling",
    tagline: "Documenting process and capturing form",
    description: "Photography sharpens my eye for detail, light, and spatial relationships — skills that translate directly into better prototype presentation and visual communication. I document process as much as final outcomes.",
    details: ["Product and prototype photography for portfolio and documentation", "Process photography: capturing the making, not just the made", "Lighting setups for controlled studio and field shots", "Composition and visual hierarchy in still images", "Photo editing and colour grading in Lightroom and Capture One"],
    tags: ["Product Photography", "Composition", "Lighting", "Lightroom"],
    color: "oklch(0.82 0.10 60)",
  },
  {
    id: "int6", icon: "⬢",
    title: "Interaction Design Research",
    tagline: "Novel inputs, tangible interfaces, and the future of HCI",
    description: "Reading papers, attending talks, and experimenting with novel input modalities — from tangible interfaces to voice and gesture-based interactions. Staying at the frontier of HCI research directly informs what I prototype.",
    details: ["Following CHI, UIST, and TEI conference proceedings", "Experimenting with gesture and spatial input (Leap Motion, MediaPipe)", "Tangible user interfaces and physical-digital integration", "Voice and conversational UI prototyping", "Accessibility considerations in novel interaction paradigms"],
    tags: ["HCI", "Tangible UI", "Gesture", "Research", "CHI", "UIST"],
    color: "oklch(0.70 0.18 168)",
  },
];

function InterestPanel({ interest, onClose }: { interest: (typeof interests)[0]; onClose: () => void }) {
  const t = useTokens();
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "oklch(0.05 0.01 240 / 0.7)", backdropFilter: "blur(4px)", zIndex: 100, cursor: "none" }}
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(600px, 95vw)", background: t.panelBg, borderLeft: `1px solid ${t.border}`, zIndex: 101, overflowY: "auto", padding: "3rem 2.5rem" }}
      >
        <button onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: `1px solid ${t.border}`, color: t.textSecondary, width: "36px", height: "36px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", cursor: "none", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = interest.color; e.currentTarget.style.borderColor = `${interest.color}55`; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
          aria-label="Close panel"
        >✕</button>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "2.5rem", color: interest.color, marginBottom: "1.5rem", lineHeight: 1 }}>
          {interest.icon}
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "0.5rem" }}>
          {interest.tagline}
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "2rem" }}>
          {interest.title}
        </h2>
        <div style={{ height: "1px", background: t.borderSubtle, marginBottom: "2rem" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.8, color: t.textSecondary, marginBottom: "2rem" }}>
          {interest.description}
        </p>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "1rem" }}>
            What I do with it
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {interest.details.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.6, color: t.textSecondary }}>
                <span style={{ color: interest.color, flexShrink: 0, marginTop: "0.3rem", fontSize: "0.5rem" }}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "1rem" }}>
            Tools & Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {interest.tags.map((tag) => (
              <span key={tag} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: interest.color, border: `1px solid ${interest.color}44`, padding: "0.25rem 0.75rem", borderRadius: "2px" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function InterestCard({ interest, index, onClick }: { interest: (typeof interests)[0]; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const t = useTokens();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered ? t.surface2 : t.surface,
        border: `1px solid ${hovered ? `${interest.color}44` : t.border}`,
        padding: "2rem", borderRadius: "2px",
        transition: "all 0.3s ease", cursor: "none",
        position: "relative", overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ position: "absolute", bottom: 0, right: 0, width: "60px", height: "60px", background: `radial-gradient(circle at bottom right, ${interest.color}18, transparent 70%)`, pointerEvents: "none" }}
      />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.5rem", color: hovered ? interest.color : t.textDim, marginBottom: "1rem", transition: "color 0.3s ease", lineHeight: 1 }}>
        {interest.icon}
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: t.textPrimary, marginBottom: "0.75rem", lineHeight: 1.3 }}>
        {interest.title}
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: t.textSecondary, marginBottom: "1.25rem" }}>
        {interest.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {interest.tags.slice(0, 3).map((tag) => (
          <span key={tag} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: hovered ? interest.color : t.textMuted, border: `1px solid ${hovered ? `${interest.color}44` : t.borderSubtle}`, padding: "0.2rem 0.6rem", borderRadius: "2px", transition: "all 0.3s ease" }}>
            {tag}
          </span>
        ))}
        {interest.tags.length > 3 && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDim, padding: "0.2rem 0.4rem" }}>
            +{interest.tags.length - 3}
          </span>
        )}
      </div>
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        style={{ position: "absolute", bottom: "1rem", right: "1rem", fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: interest.color }}
      >
        Explore →
      </motion.div>
    </motion.div>
  );
}

export default function InterestsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeInterest, setActiveInterest] = useState<(typeof interests)[0] | null>(null);
  const t = useTokens();

  return (
    <section id="interests" ref={ref} className="relative py-32 overflow-hidden" style={{ background: t.bg }}>
      <span className="section-number" style={{ right: "-2rem", top: "2rem", color: t.sectionNumber }}>04</span>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-4"
        >
          <span className="accent-line" style={{ background: t.mint }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.mint }}>
            Interests
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "1rem" }}
        >
          What drives me{" "}
          <span className="text-gradient">beyond the brief</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: t.textSecondary, maxWidth: "560px", marginBottom: "3rem" }}
        >
          The things I explore outside of work directly inform how I approach problems.
          Making, experimenting, and researching are not hobbies — they're how I stay sharp.{" "}
          <span style={{ color: t.textDim, fontStyle: "italic" }}>Click any card to explore further.</span>
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interests.map((interest, i) => (
            <InterestCard key={interest.id} interest={interest} index={i} onClick={() => setActiveInterest(interest)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeInterest && <InterestPanel interest={activeInterest} onClose={() => setActiveInterest(null)} />}
      </AnimatePresence>
    </section>
  );
}
