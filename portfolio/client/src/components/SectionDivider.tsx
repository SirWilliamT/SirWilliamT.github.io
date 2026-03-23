/**
 * SectionDivider — "Liquid Precision" Design System
 * Thin gradient line between major sections. Theme-aware via useTokens().
 */

import { useTokens } from "@/lib/theme-tokens";

export default function SectionDivider() {
  const t = useTokens();
  return (
    <div
      style={{
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${t.mint}26, ${t.violet}1a, transparent)`,
        margin: "0",
      }}
    />
  );
}
