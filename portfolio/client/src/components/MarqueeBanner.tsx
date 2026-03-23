/**
 * MarqueeBanner — "Liquid Precision" Design System
 * Infinite horizontal scrolling ticker with skill/tool keywords.
 * Theme-aware via useTokens().
 */

import { useTokens } from "@/lib/theme-tokens";

const items = [
  "Rapid Prototyping", "◈", "Figma", "◈", "Arduino", "◈",
  "3D Printing", "◈", "React", "◈", "TouchDesigner", "◈",
  "Hardware Design", "◈", "WebGL", "◈", "User Research", "◈",
  "Fusion 360", "◈", "Creative Technology", "◈", "PCB Design", "◈",
];

function Track({ t }: { t: ReturnType<typeof useTokens> }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, whiteSpace: "nowrap", flexShrink: 0 }}>
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            fontFamily: item === "◈" ? "'Space Mono', monospace" : "'Space Grotesk', sans-serif",
            fontWeight: item === "◈" ? 400 : 500,
            fontSize: item === "◈" ? "0.5rem" : "0.78rem",
            letterSpacing: item === "◈" ? "0" : "0.06em",
            color: item === "◈" ? t.mint : t.textMuted,
            padding: item === "◈" ? "0 1.5rem" : "0 0.25rem",
            textTransform: "uppercase",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function MarqueeBanner() {
  const t = useTokens();
  return (
    <div
      className="relative overflow-hidden py-5"
      style={{
        borderTop: `1px solid ${t.borderSubtle}`,
        borderBottom: `1px solid ${t.borderSubtle}`,
        background: t.surface,
      }}
    >
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          animation: marquee-scroll 35s linear infinite;
          will-change: transform;
        }
        .marquee-inner:hover { animation-play-state: paused; }
      `}</style>

      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${t.surface}, transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${t.surface}, transparent)` }} />

      <div className="marquee-inner">
        <Track t={t} />
        <Track t={t} />
      </div>
    </div>
  );
}
