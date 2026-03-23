/**
 * ScrambleText — cycles through a list of titles with a character-scramble
 * reveal animation. Ported from the vanilla JS scramble effect in index.html.
 *
 * Design: "Liquid Precision" — Space Mono, mint accent, uppercase label style.
 */

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?";
const INTERVAL_MS = 2800;

interface ScrambleTextProps {
  titles: string[];
  /** Optional className forwarded to the outer span */
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrambleText({ titles, className, style }: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState(titles[0] ?? "");
  const currentIdx = useRef(0);
  const rafRef = useRef<number | null>(null);

  function scrambleTo(target: string) {
    // Cancel any in-progress animation
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    let frame = 0;
    const totalFrames = target.length * 4;

    function tick() {
      let result = "";
      for (let i = 0; i < target.length; i++) {
        const resolveAt = i * 4;
        if (frame >= resolveAt + 4) {
          result += target[i];
        } else if (target[i] === " ") {
          result += " ";
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplayed(result);
      frame++;
      if (frame <= totalFrames + 3) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(target);
        rafRef.current = null;
      }
    }

    tick();
  }

  useEffect(() => {
    const timer = setInterval(() => {
      currentIdx.current = (currentIdx.current + 1) % titles.length;
      scrambleTo(titles[currentIdx.current]);
    }, INTERVAL_MS);

    return () => {
      clearInterval(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titles]);

  return (
    <span className={className} style={style}>
      {displayed}
    </span>
  );
}
