/**
 * ContactSection — "Liquid Precision" Design System
 * Minimal contact section with large CTA, social links, and email.
 * Theme-aware via useTokens().
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTokens } from "@/lib/theme-tokens";

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "↗" },
  { label: "GitHub", href: "https://github.com", icon: "↗" },
  { label: "Dribbble", href: "https://dribbble.com", icon: "↗" },
  { label: "Twitter / X", href: "https://twitter.com", icon: "↗" },
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTokens();

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: t.surface }}
    >
      <span className="section-number" style={{ left: "-1rem", top: "2rem", color: t.sectionNumber }}>
        05
      </span>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="accent-line" style={{ background: t.mint }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.mint }}>
            Contact
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-end">
          {/* Left: Big CTA */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.0, letterSpacing: "-0.03em", color: t.textPrimary, marginBottom: "1.5rem" }}
            >
              Let's build
              <br />
              <span className="text-gradient">something</span>
              <br />
              together.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: t.textSecondary, maxWidth: "420px", marginBottom: "2.5rem" }}
            >
              Whether you have a project in mind, want to discuss a collaboration,
              or just want to say hello — I'd love to hear from you.
            </motion.p>

            <motion.a
              href="mailto:william@example.com"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mint-glow"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.09 0.018 240)", background: t.mint, border: "none", padding: "1rem 2rem", borderRadius: "2px", textDecoration: "none", cursor: "none", transition: "opacity 0.2s ease, transform 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Send a Message
              <span style={{ fontSize: "1rem" }}>→</span>
            </motion.a>
          </div>

          {/* Right: Info + Social */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-10">
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "0.5rem" }}>
                Email
              </div>
              <a href="mailto:william@example.com" className="hover-underline"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: "1.1rem", color: t.textPrimary, textDecoration: "none", cursor: "none" }}
              >
                william@example.com
              </a>
            </div>

            <div className="mb-10">
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "0.5rem" }}>
                Location
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: "1.1rem", color: t.textPrimary }}>
                Available Remotely · Open to Relocation
              </span>
            </div>

            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: t.textDim, marginBottom: "1rem" }}>
                Connect
              </div>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: t.textSecondary, textDecoration: "none", border: `1px solid ${t.border}`, padding: "0.5rem 1rem", borderRadius: "2px", display: "flex", alignItems: "center", gap: "0.4rem", cursor: "none", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = t.mint; e.currentTarget.style.borderColor = `${t.mint}55`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
                  >
                    {link.label}
                    <span style={{ fontSize: "0.8rem" }}>{link.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-24 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${t.borderSubtle}` }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: t.textDim }}>
            © {new Date().getFullYear()} William. All rights reserved.
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", color: t.textDim }}>
            Designed & built with{" "}
            <span style={{ color: t.mint }}>precision</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
