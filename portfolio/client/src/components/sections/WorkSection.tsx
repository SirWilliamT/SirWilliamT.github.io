/**
 * WorkSection — "Liquid Precision" Design System
 *
 * Portfolio-first work section. Projects are the primary content;
 * company / role context is secondary metadata on each card.
 *
 * Layout: explicit 2-column grid on desktop, 1-column on mobile.
 * Cards with `featured: true` span both columns and include a
 * media placeholder (image or video) at the top — ideal for
 * visually-led work like installations and generative systems.
 * Standard cards sit in the 2-col grid below.
 *
 * No `gridRow: span` is used — all spanning is done via
 * `gridColumn: "1 / -1"` on featured cards only, which avoids
 * the auto-placement gap bug.
 *
 * Section ID kept as "experience" so all existing nav anchors remain valid.
 * Theme-aware via useTokens().
 */

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTokens } from "@/lib/theme-tokens";

// ─── Data ────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: "proj_horizonevents",
    title: "Horizon Events",
    outcome: "Defined the stereoscopic viewing standards, seating systems, and immersive content formats that shaped how audiences experience large-scale virtual events on Meta's Horizon platform.",
    tags: ["Product Design Prototyping", "Spatial/3D UX Design", "Stereoscopic Video & Cinematography", "Human Factors / Visual Comfort Research", "Interaction Design", "User Research & Usability Testing", "Technical Writing", "Content Strategy", "Quality Assurance / Dogfooding"],
    context: { company: "Meta", role: "Product Design Prototyper", period: "2024-2026" },
    type: "Product",
    color: "oklch(0.62 0.22 285)", // violet
    featured: true,
    // Replace with your own image URL or video URL. Supported: .jpg, .png, .gif, .mp4, .webm
    mediaUrl: "/media/events_cp_original.mp4",
    mediaType: "video" as "image" | "video",
    description:
      "Led prototyping of a format that blends captured concert footage with a rendered virtual environment, optimising stereo comfort, seating layouts, and camera positioning. The resulting guidelines became the reference for external production partners. I also developed a crowd-masking technique using animated virtual characters to reduce depth artefacts in captured footage.",
    outcomes: [
      "Stereoscopic concert guidelines became the reference for external production partners",
      "Stereo comfort zone method adopted as the standard for event arenas, including Meta's flagship conference arena",
      "Seating prototypes directly informed product direction for the platform's seating experience",
	  "User studies confirmed 50% of attendees preferred to sit, validating the seating system investment",
	  "White paper on eye comfort for stereoscopic video established the design framework for future 3D cinema projects",
	  "Custom Unity stereo visualisation tool enabled designers and engineers to reason about depth in real time",
	  "Themed cinema explorations demonstrated potential for branded, narrative-driven viewing experiences",
	  "Content format analysis influenced the team's approach to stereoscopic content and raised awareness of depth-conflict constraints",
	  "\"Better than live\" prototypes expanded the content delivery vision beyond traditional formats",
	  "Reusable code, easings library, and UI toolkit upgrades adopted across teams, boosting cross-functional velocity",
	  "Bug reports from dogfooding triaged into engineering tasks and tracked to resolution",
	  "AI-augmented workflows achieved 4× productivity gains in component development",
    ],
    tools: ["Unity", "C#", "Typescript", "THREE.js", "React", "Horizon Studio", "Blender", "Gimp", "VS Code", "Generative AI", "Meta Quest"],
    process:
      "**Stereoscopic Concert Experiences**\nLed prototyping of a format that blends captured concert footage with a rendered virtual environment, optimizing stereo comfort, seating layouts, and camera positioning. The resulting guidelines became the reference for external production partners. I also developed a crowd-masking technique using animated virtual characters to reduce depth artefacts in captured footage.\n\n**Stereo Comfort Zones**\nDeveloped a method for calculating safe audience positioning relative to stereoscopic content. Adopted as the standard for event arenas, including the arena used at Meta's flagship annual conference.\n\n**Seating System Design**\nDesigned and iterated on seating prototypes defining how users navigate, change, and leave seats. Directly informed product direction for the platform's seating experience. User studies confirmed half of attendees preferred to sit.\n\n**Immersive 3D Cinema**\nLed prototyping for VR cinema experiences, authoring a white paper on eye comfort for stereoscopic video and building a custom Unity stereo visualization tool. Resolved vertigo/comfort issues through iteration and explored themed environments for branded viewing experiences.\n\n**Content Format Strategy & Mixed Media**\nAnalyzed content formats (360°, 180° stereo, mixed) for virtual events, identifying depth-conflict challenges and influencing the team's approach to stereoscopic content. Contributed to \"better than live\" prototypes exploring mixed media beyond traditional formats.\n\n**Tooling, Quality & AI Workflows**\nContributed reusable code, custom animation easings, UI toolkit upgrades, and documentation improvements — adopted across teams. Regularly dogfooded and filed bugs triaged into engineering tasks. Leveraged generative AI for 4× productivity gains in component development and 5× acceleration in visual asset production.\n\n",
  },
  {
    id: "proj_workroomsvr",
    title: "Workrooms VR",
    outcome: "Reduced time-to-value by 38% across three product lines",
    tags: ["Product Design Prototyping", "3D Reviews", "VR Meetings", "Content Strategy", "Quality Assurance / Dogfooding", "Spatial/3D UX Design", "Interaction Design", "User Research & Usability Testing"],
    context: { company: "Meta", role: "Product Design Prototyper", period: "2022-2024" },
    type: "Product",
    color: "oklch(0.88 0.18 168)", // mint
    featured: false,
    mediaUrl: null as string | null,
    mediaType: "image" as "image" | "video",
    description:
      "Designed and built a fully interactive prototype for an adaptive onboarding flow that branched based on user role and prior experience. The prototype was used directly in stakeholder presentations and informed the final engineering spec.",
    outcomes: [
      "38% reduction in time-to-value measured across 3 product lines in A/B test",
      "Prototype adopted as the canonical reference for the engineering team's build",
      "Onboarding completion rate increased from 61% to 84% in post-launch data",
    ],
    tools: ["Figma", "React", "Framer Motion", "UserTesting", "Maze"],
    process:
      "Started with a two-day discovery sprint mapping every existing onboarding path. Identified 11 distinct user archetypes. Built a branching prototype in Framer, then ported the validated interactions to a React component library for handoff.",
  },
  {
    id: "proj3",
    title: "XR Spatial UI Framework",
    outcome: "Reusable component library now used across 5 internal XR projects",
    tags: ["XR / AR", "Spatial Design", "Unity"],
    context: { company: "Acme Design Studio", role: "Senior Prototyper", period: "2022" },
    type: "Framework",
    color: "oklch(0.75 0.15 200)", // teal
    featured: false,
    mediaUrl: null as string | null,
    mediaType: "image" as "image" | "video",
    description:
      "Designed and prototyped a spatial UI component library for mixed-reality headsets. Addressed legibility, depth cuing, and hand-tracking affordances — problems that standard 2D design systems don't solve.",
    outcomes: [
      "Library adopted across 5 active XR projects within the studio",
      "Halved the time to scaffold a new XR prototype from ~3 days to ~1.5 days",
      "Published as an internal design-system package with versioned releases",
    ],
    tools: ["Unity", "MRTK", "Figma", "C#", "Meta Quest SDK"],
    process:
      "Audited 12 existing XR prototypes to extract recurring UI patterns. Defined a spatial token system (depth, scale, opacity) analogous to a 2D design token set. Built each component with configurable hand-tracking and gaze-dwell interaction modes.",
  },
  {
    id: "proj5",
    title: "Generative Identity System",
    outcome: "Algorithmic brand identity with 10,000+ unique asset variations",
    tags: ["Generative Design", "Creative Coding", "Branding"],
    context: { company: "Nexus Interactive", role: "Creative Technologist", period: "2020" },
    type: "Creative",
    color: "oklch(0.70 0.20 330)", // rose
    featured: true,
    // Replace with your own image URL or video URL. Supported: .jpg, .png, .gif, .mp4, .webm
    mediaUrl: null as string | null,
    mediaType: "video" as "image" | "video",
    description:
      "Developed a generative visual identity system for a music festival brand. A custom Processing sketch produced thousands of unique poster, social, and merchandise variations from a single parametric source — all on-brand, none identical.",
    outcomes: [
      "10,000+ unique asset variations generated from a single parametric source",
      "Eliminated 80% of manual asset production time for the client's marketing team",
      "Identity system won a regional design award for innovation in brand systems",
    ],
    tools: ["Processing", "p5.js", "Figma", "After Effects", "Python"],
    process:
      "Defined the brand's visual grammar as a set of constrained parameters (palette, geometry, rhythm). Built a Processing sketch exposing those parameters as sliders. Delivered the sketch alongside a style guide so the client's team could generate assets independently.",
  },
  {
    id: "proj4",
    title: "IoT Device Companion App",
    outcome: "0→1 product shipped; 2,400 units sold in first quarter",
    tags: ["Product Design", "Embedded", "Mobile"],
    context: { company: "Freelance", role: "Independent Prototyper", period: "2019" },
    type: "Product",
    color: "oklch(0.78 0.12 45)", // amber
    featured: false,
    mediaUrl: null as string | null,
    mediaType: "image" as "image" | "video",
    description:
      "Solo prototyper for an early-stage hardware startup building a connected home sensor. Designed the companion mobile app and the embedded firmware UI, then built functional prototypes used to close a seed funding round.",
    outcomes: [
      "Prototypes directly supported a successful seed funding pitch",
      "2,400 units sold in the first quarter post-launch",
      "App store rating of 4.6 / 5 at launch based on beta-tester feedback",
    ],
    tools: ["Figma", "React Native", "Arduino", "Bluetooth LE", "Expo"],
    process:
      "Ran a 3-day design sprint with the founding team to align on core use cases. Built a clickthrough prototype in Figma for investor demos. Simultaneously developed a functional BLE-connected prototype on Arduino to validate the hardware UX.",
  },
  {
    id: "proj6",
    title: "Rapid Prototyping Workflow",
    outcome: "Studio-wide process that cut concept-to-demo time by 40%",
    tags: ["Process Design", "Tooling", "Figma"],
    context: { company: "Acme Design Studio", role: "Senior Prototyper", period: "2022" },
    type: "Process",
    color: "oklch(0.82 0.10 120)", // lime
    featured: false,
    mediaUrl: null as string | null,
    mediaType: "image" as "image" | "video",
    description:
      "Designed and documented a standardised rapid-prototyping workflow for a 12-person cross-functional studio. Covered tool selection, fidelity ladders, handoff conventions, and a shared Figma component library — reducing repeated setup work across every new project.",
    outcomes: [
      "40% reduction in concept-to-demo time measured across 8 projects",
      "Shared Figma library adopted by 3 product teams within 6 weeks",
      "Onboarding time for new prototypers reduced from 2 weeks to 3 days",
    ],
    tools: ["Figma", "Notion", "Loom", "GitHub", "Storybook"],
    process:
      "Ran a retrospective across 6 recent projects to identify recurring friction points. Mapped the full prototyping lifecycle and defined four fidelity tiers with clear entry/exit criteria. Piloted the workflow on two live projects before rolling out studio-wide.",
  },
];

// ─── Media Placeholder ───────────────────────────────────────────────────────

function MediaBlock({
  project,
  hovered,
}: {
  project: (typeof projects)[0];
  hovered: boolean;
}) {
  const t = useTokens();

  // If a real URL is provided, render the actual media
  if (project.mediaUrl) {
    if (project.mediaType === "video") {
      return (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden", borderRadius: "2px", marginBottom: "1.5rem" }}>
          <video
            src={project.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      );
    }
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden", borderRadius: "2px", marginBottom: "1.5rem" }}>
        <img
          src={project.mediaUrl}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  // Placeholder — shows a labelled drop-zone with the project accent colour
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/7",
        overflow: "hidden",
        borderRadius: "2px",
        marginBottom: "1.5rem",
        background: `${project.color}0a`,
        borderWidth: "1px",
        borderStyle: "dashed",
        borderColor: hovered ? `${project.color}77` : `${project.color}44`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Icon */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke={project.color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.6 }}
      >
        {project.mediaType === "video" ? (
          <>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
            <path d="M10 9l5 3-5 3V9z" />
          </>
        ) : (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </>
        )}
      </svg>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: project.color,
          opacity: 0.7,
        }}
      >
        {project.mediaType === "video" ? "Add video" : "Add image"} · replace mediaUrl in WorkSection.tsx
      </span>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function WorkPanel({
  project,
  onClose,
}: {
  project: (typeof projects)[0];
  onClose: () => void;
}) {
  const t = useTokens();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
          position: "fixed",
          inset: 0,
          background: "oklch(0.05 0.01 240 / 0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 100,
          cursor: "none",
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(640px, 95vw)",
          background: t.panelBg,
          borderLeft: `1px solid ${t.border}`,
          zIndex: 101,
          overflowY: "auto",
          padding: "3rem 2.5rem",
        }}
      >
        {/* Coloured accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: project.color,
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "none",
            border: `1px solid ${t.border}`,
            color: t.textSecondary,
            width: "36px",
            height: "36px",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            cursor: "none",
            transition: "all 0.2s ease",
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
        >
          ✕
        </button>

        {/* Media in panel (featured projects only) */}
        {project.featured && project.mediaUrl && (
          <div style={{ marginBottom: "2rem", marginTop: "0.5rem", borderRadius: "2px", overflow: "hidden" }}>
            {project.mediaType === "video" ? (
              <video
                src={project.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", display: "block", borderRadius: "2px" }}
              />
            ) : (
              <img
                src={project.mediaUrl}
                alt={project.title}
                style={{ width: "100%", display: "block", borderRadius: "2px" }}
              />
            )}
          </div>
        )}

        {/* Type badge */}
        <div
          style={{
            display: "inline-block",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "oklch(0.09 0.018 240)",
            background: project.color,
            padding: "0.25rem 0.75rem",
            borderRadius: "2px",
            marginBottom: "1.5rem",
            marginTop: "0.5rem",
          }}
        >
          {project.type}
        </div>

        {/* Project title */}
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: t.textPrimary,
            marginBottom: "0.75rem",
          }}
        >
          {project.title}
        </h2>

        {/* One-line outcome */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.5,
            color: project.color,
            marginBottom: "1.5rem",
            fontStyle: "italic",
          }}
        >
          {project.outcome}
        </p>

        {/* Role context */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ marginBottom: "2rem" }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: t.textDim }}>
            {project.context.company}
          </span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, display: "block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: t.textDim }}>
            {project.context.role}
          </span>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: t.textDim, display: "block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: t.textDim }}>
            {project.context.period}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: t.borderSubtle, marginBottom: "2rem" }} />

        {/* Description */}
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.8, color: t.textSecondary, marginBottom: "2rem" }}>
          {project.description}
        </p>

        {/* Process */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "0.75rem" }}>
            How it was made
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.8, color: t.textSecondary }}>
            {project.process.split(/\n\n+/).map((para, i) => (
              <p key={i} style={{ marginBottom: "0.75rem" }}
                dangerouslySetInnerHTML={{
                  __html: para
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.+?)\*/g, "<em>$1</em>")
                    .replace(/\n/g, "<br/>")
                }}
              />
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "1rem" }}>
            Outcomes
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {project.outcomes.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.6, color: t.textSecondary }}>
                <span style={{ color: project.color, marginTop: "0.35rem", flexShrink: 0, fontSize: "0.6rem" }}>▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "1rem" }}>
            Tools & Technologies
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: project.color,
                  border: `1px solid ${project.color}33`,
                  padding: "0.3rem 0.75rem",
                  borderRadius: "2px",
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function WorkCard({
  project,
  index,
  isInView,
  onClick,
}: {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  const t = useTokens();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? t.surfaceHover : t.surface2,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: hovered ? project.color + "55" : t.borderSubtle,
        borderRadius: "4px",
        padding: "1.75rem",
        cursor: "none",
        transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 12px 40px ${project.color}18, 0 0 0 1px ${project.color}22`
          : "none",
        // Featured cards span full width
        gridColumn: project.featured ? "1 / -1" : undefined,
      }}
    >
      {/* Coloured top accent bar */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: project.color,
          borderRadius: "4px 4px 0 0",
          transformOrigin: "left",
        }}
      />

      {/* Media block — only on featured cards */}
      {project.featured && (
        <MediaBlock project={project} hovered={hovered} />
      )}

      {/* Type + period row */}
      <div className="flex items-center justify-between" style={{ marginBottom: "1.25rem" }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: project.color,
            background: `${project.color}18`,
            padding: "0.2rem 0.6rem",
            borderRadius: "2px",
          }}
        >
          {project.type}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: t.textDim }}>
          {project.context.period}
        </span>
      </div>

      {/* Project title */}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: project.featured ? "clamp(1.2rem, 2.5vw, 1.6rem)" : "clamp(1.05rem, 2vw, 1.3rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: t.textPrimary,
          marginBottom: "0.6rem",
          transition: "color 0.2s ease",
        }}
      >
        {project.title}
      </h3>

      {/* One-line outcome */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          color: t.textSecondary,
          marginBottom: "1.25rem",
          maxWidth: project.featured ? "60ch" : undefined,
        }}
      >
        {project.outcome}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: "1.5rem" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: t.textMuted,
              border: `1px solid ${t.borderSubtle}`,
              padding: "0.15rem 0.5rem",
              borderRadius: "2px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: company context + open hint */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.textDim,
          }}
        >
          {project.context.company}
        </span>
        <motion.span
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            color: project.color,
          }}
        >
          Open case study →
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function WorkSection() {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const t = useTokens();

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <>
      <section
        id="experience"
        ref={ref}
        className="relative py-32 overflow-hidden"
        style={{ background: t.surface }}
      >
        {/* Watermark number */}
        <span
          className="section-number"
          style={{ right: "-2rem", top: "2rem", color: t.sectionNumber }}
        >
          02
        </span>

        <div className="container">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="accent-line" style={{ background: t.mint }} />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: t.mint,
              }}
            >
              Work
            </span>
          </motion.div>

          {/* Heading */}
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
              marginBottom: "0.75rem",
            }}
          >
            Things I've{" "}
            <span className="text-gradient">actually built</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              color: t.textDim,
              marginBottom: "3.5rem",
            }}
          >
            Click any card to read the full case study →
          </motion.p>

          {/*
           * Card grid — explicit 2-column layout on desktop.
           * Featured cards use gridColumn: "1 / -1" to span both columns.
           * No gridRow span is used, which prevents auto-placement gaps.
           */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.25rem",
            }}
          >
            {projects.map((project, i) => (
              <WorkCard
                key={project.id}
                project={project}
                index={i}
                isInView={isInView}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedProject && (
          <WorkPanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
