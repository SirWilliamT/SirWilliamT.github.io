/**
 * TopNav — "Liquid Precision" Design System
 * Minimal fixed top navigation. Transparent → frosted glass on scroll.
 * Includes sun/moon theme toggle button at top right.
 */

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTokens } from "@/lib/theme-tokens";

const NAV_LINKS = [
  { label: "Work", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Interests", href: "#interests" },
  { label: "Contact", href: "#contact" },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function TopNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const t = useTokens();
  const isDark = theme === "dark";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        animate={{
          backgroundColor: scrolled ? t.navBg : `${t.bg.replace(")", " / 0)")}`,
          borderBottomColor: scrolled ? t.border : `${t.border.replace(")", " / 0)")}`,
        }}
        transition={{ duration: 0.3 }}
        style={{
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: "1px solid",
        }}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo / Name */}
          <button
            onClick={() => scrollTo("#hero")}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: t.textPrimary,
              letterSpacing: "-0.03em",
              background: "none",
              border: "none",
              cursor: "none",
            }}
          >
            W<span style={{ color: t.mint }}>.</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.textMuted,
                  background: "none",
                  border: "none",
                  cursor: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = t.textPrimary;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = t.textMuted;
                }}
              >
                {link.label}
              </button>
            ))}

            {/* Theme toggle */}
            {toggleTheme && (
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "2px",
                  border: `1px solid ${t.border}`,
                  background: "none",
                  color: t.textMuted,
                  cursor: "none",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = t.mint;
                  el.style.borderColor = `${t.mint}66`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = t.textMuted;
                  el.style.borderColor = t.border;
                }}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                <motion.div
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDark ? <MoonIcon /> : <SunIcon />}
                </motion.div>
              </motion.button>
            )}

            {/* CTA */}
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isDark ? "oklch(0.09 0.018 240)" : "oklch(0.97 0.006 240)",
                background: t.mint,
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: "2px",
                cursor: "none",
                transition: "opacity 0.2s ease",
                boxShadow: `0 0 16px ${t.mint}33`,
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
            >
              Hire Me
            </button>
          </nav>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "2px",
                  border: `1px solid ${t.border}`,
                  background: "none",
                  color: t.textMuted,
                  cursor: "none",
                }}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </button>
            )}
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ cursor: "none", background: "none", border: "none" }}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                style={{ display: "block", width: "20px", height: "1px", background: t.textPrimary }}
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1 }}
                style={{ display: "block", width: "20px", height: "1px", background: t.textPrimary }}
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                style={{ display: "block", width: "20px", height: "1px", background: t.textPrimary }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        className="fixed top-16 left-0 right-0 z-30 md:hidden"
        style={{
          background: `${t.navBg}`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${t.border}`,
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        <div className="container py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-left"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: t.textSecondary,
                background: "none",
                border: "none",
                padding: "0.5rem 0",
                cursor: "none",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
