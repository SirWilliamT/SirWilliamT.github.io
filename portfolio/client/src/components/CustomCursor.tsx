/**
 * CustomCursor — "Liquid Precision" Design System
 * A mint dot with a trailing ring that follows the cursor.
 * Theme-aware: ring colors adapt to light/dark mode via useTokens().
 *
 * Ring size behaviour:
 *   - Stationary / slow cursor  → ring contracts to RING_MIN (small, tight)
 *   - Ring catching up (lag > 0) → ring expands toward RING_MAX proportionally
 *   - Hovering interactive element → ring expands to RING_HOVER
 *   - Click → ring pops outward and shifts to violet tint
 */

import { useEffect, useRef } from "react";
import { useTokens } from "@/lib/theme-tokens";

// Ring size constants (half-size / radius in px)
const RING_MIN   = 10;  // contracted when stationary
const RING_MAX   = 22;  // fully expanded when catching up fast
const RING_HOVER = 30;  // expanded when hovering interactive element
const LAG_SCALE  = 40;  // lag distance (px) at which ring reaches RING_MAX

export default function CustomCursor() {
  const dotRef        = useRef<HTMLDivElement>(null);
  const ringRef       = useRef<HTMLDivElement>(null);
  const posRef        = useRef({ x: -100, y: -100 });
  const ringPosRef    = useRef({ x: -100, y: -100 });
  const ringSizeRef   = useRef(RING_MIN);
  const isHoveringRef = useRef(false);
  const isClickingRef = useRef(false);
  const clickPopRef   = useRef(0);
  const rafRef        = useRef<number>(0);

  // Read current theme tokens — these update reactively when theme changes
  const t = useTokens();
  // Store in a ref so the RAF loop always reads the latest value without re-running useEffect
  const tokensRef = useRef(t);
  tokensRef.current = t;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);

    const handleMouseDown = () => {
      isClickingRef.current = true;
      clickPopRef.current = 1.0;
      if (ringRef.current) {
        // Violet tint on click — same in both modes
        ringRef.current.style.borderColor = "oklch(0.62 0.22 285 / 0.9)";
      }
    };
    const handleMouseUp = () => {
      isClickingRef.current = false;
      if (ringRef.current) {
        const tk = tokensRef.current;
        ringRef.current.style.borderColor = isHoveringRef.current
          ? `${tk.mint}cc`
          : `${tk.mint}80`;
      }
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${posRef.current.x}px`;
        dotRef.current.style.top  = `${posRef.current.y}px`;
      }

      if (ringRef.current) {
        ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
        ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;
        ringRef.current.style.left = `${ringPosRef.current.x}px`;
        ringRef.current.style.top  = `${ringPosRef.current.y}px`;

        const lagX = posRef.current.x - ringPosRef.current.x;
        const lagY = posRef.current.y - ringPosRef.current.y;
        const lag  = Math.sqrt(lagX * lagX + lagY * lagY);

        clickPopRef.current *= 0.82;
        const popBonus = clickPopRef.current * 14;

        if (!isHoveringRef.current) {
          const tLag       = Math.min(lag / LAG_SCALE, 1);
          const targetSize = RING_MIN + (RING_MAX - RING_MIN) * tLag;
          ringSizeRef.current += (targetSize - ringSizeRef.current) * 0.15;
        } else {
          ringSizeRef.current += (RING_HOVER - ringSizeRef.current) * 0.15;
        }
        const s = ringSizeRef.current + popBonus;
        ringRef.current.style.width  = `${s * 2}px`;
        ringRef.current.style.height = `${s * 2}px`;

        // Keep ring color in sync with current theme (unless clicking)
        if (!isClickingRef.current) {
          const tk = tokensRef.current;
          ringRef.current.style.borderColor = isHoveringRef.current
            ? `${tk.mint}cc`
            : `${tk.mint}80`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const handleHoverIn = () => {
      isHoveringRef.current = true;
    };
    const handleHoverOut = () => {
      isHoveringRef.current = false;
    };

    const interactives = document.querySelectorAll("a, button, [role='button']");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverIn);
      el.addEventListener("mouseleave", handleHoverOut);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(rafRef.current);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverIn);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ background: t.mint }} />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
