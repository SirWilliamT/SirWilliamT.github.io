/**
 * NavDots — "Liquid Precision" Design System
 * Fixed left-side vertical navigation with section indicator dots.
 * Theme-aware via useTokens().
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTokens } from "@/lib/theme-tokens";

const SECTIONS = [
  { id: "hero",       label: "Home" },
  { id: "experience", label: "Work" },
  { id: "about",      label: "About" },
  { id: "skills",     label: "Skills" },
  { id: "interests",  label: "Interests" },
  { id: "contact",    label: "Contact" },
];

export default function NavDots() {
  const [active, setActive]   = useState("hero");
  const [visible, setVisible] = useState(false);
  const t = useTokens();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80);
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActive(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 items-center"
      aria-label="Section navigation"
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            aria-label={`Navigate to ${section.label}`}
            className="group relative flex items-center gap-3"
            style={{ cursor: "none" }}
          >
            {/* Label tooltip */}
            <span
              className="absolute left-6 font-mono-label text-xs uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: t.textMuted, fontSize: "0.65rem" }}
            >
              {section.label}
            </span>

            {/* Dot */}
            <motion.div
              animate={{
                width: isActive ? "24px" : "6px",
                backgroundColor: isActive ? t.mint : t.border,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ height: "6px", borderRadius: "3px" }}
            />
          </button>
        );
      })}
    </motion.nav>
  );
}
