/**
 * ContactSection — "Liquid Precision" Design System
 * Minimal contact section with large CTA that opens a slide-in form panel.
 * Form submits via Formspree (no email exposed in source).
 * Theme-aware via useTokens().
 */

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useTokens } from "@/lib/theme-tokens";

// Web3Forms — no account setup needed beyond getting a free access key.
// 1. Go to https://web3forms.com
// 2. Enter william.tian@gmail.com and click "Create Access Key"
// 3. Paste the key they email you below — it is safe to be public in source.
const WEB3FORMS_KEY = "914ccd03-0492-4897-9fe4-c14bd0178874";

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/william-tian-2a92973/", icon: "↗" },
  //{ label: "GitHub", href: "https://github.com", icon: "↗" },
  //{ label: "Dribbble", href: "https://dribbble.com", icon: "↗" },
  //{ label: "Twitter / X", href: "https://twitter.com", icon: "↗" },
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTokens();

  const [panelOpen, setPanelOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });

  const openPanel = () => { setPanelOpen(true); setFormState("idle"); };
  const closePanel = () => { setPanelOpen(false); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
      });
      if (res.ok) {
        setFormState("success");
        setFields({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  // ── Shared input style ──────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: t.surface2,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: t.border,
    borderRadius: "2px",
    padding: "0.75rem 1rem",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    color: t.textPrimary,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.62rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: t.textDim,
    marginBottom: "0.4rem",
  };

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

            <motion.button
              onClick={openPanel}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mint-glow"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.09 0.018 240)", background: t.mint, border: "none", padding: "1rem 2rem", borderRadius: "2px", cursor: "none", transition: "opacity 0.2s ease, transform 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Send a Message
              <span style={{ fontSize: "1rem" }}>→</span>
            </motion.button>
          </div>

          {/* Right: Info + Social (no email shown) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: t.textSecondary, textDecoration: "none", borderWidth: "1px", borderStyle: "solid", borderColor: t.border, padding: "0.5rem 1rem", borderRadius: "2px", display: "flex", alignItems: "center", gap: "0.4rem", cursor: "none", transition: "all 0.2s ease" }}
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

      {/* ── Slide-in Contact Form Panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closePanel}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, cursor: "none" }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(520px, 100vw)",
                background: t.panelBg,
                borderLeft: `1px solid ${t.border}`,
                zIndex: 101,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Panel header */}
              <div style={{ padding: "2rem 2rem 1.5rem", borderBottom: `1px solid ${t.borderSubtle}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.mint, marginBottom: "0.3rem" }}>
                    Get in touch
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.3rem", color: t.textPrimary }}>
                    Send a Message
                  </div>
                </div>
                <button
                  onClick={closePanel}
                  style={{ background: "none", border: `1px solid ${t.border}`, color: t.textSecondary, width: "2.25rem", height: "2.25rem", borderRadius: "2px", cursor: "none", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s, border-color 0.2s", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = t.mint; e.currentTarget.style.borderColor = t.mint; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Panel body */}
              <div style={{ padding: "2rem", flex: 1 }}>
                {formState === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", paddingTop: "4rem" }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.3rem", color: t.textPrimary, marginBottom: "0.75rem" }}>
                      Message sent
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: t.textSecondary, lineHeight: 1.6, marginBottom: "2rem" }}>
                      Thanks for reaching out. I'll get back to you as soon as I can.
                    </div>
                    <button
                      onClick={closePanel}
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.mint, background: "transparent", borderWidth: "1px", borderStyle: "solid", borderColor: t.mintDim, padding: "0.75rem 1.5rem", borderRadius: "2px", cursor: "none" }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Name */}
                    <div>
                      <label style={labelStyle}>Name <span style={{ color: t.mint }}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={fields.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = t.mint; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>Email <span style={{ color: t.mint }}>*</span></label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={fields.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = t.mint; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label style={labelStyle}>Subject</label>
                      <select
                        name="subject"
                        value={fields.subject}
                        onChange={handleChange}
                        style={{ ...inputStyle, appearance: "none" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = t.mint; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                      >
                        <option value="">Select a topic…</option>
                        <option value="Project enquiry">Project enquiry</option>
                        <option value="Collaboration">Collaboration</option>
                        <option value="Full-time opportunity">Full-time opportunity</option>
                        <option value="Freelance work">Freelance work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label style={labelStyle}>Message <span style={{ color: t.mint }}>*</span></label>
                      <textarea
                        name="message"
                        required
                        value={fields.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or idea…"
                        rows={6}
                        style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = t.mint; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = t.border; }}
                      />
                    </div>

                    {/* Error */}
                    {formState === "error" && (
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#ff6b6b", padding: "0.75rem 1rem", borderWidth: "1px", borderStyle: "solid", borderColor: "#ff6b6b44", borderRadius: "2px", background: "#ff6b6b0a" }}>
                        Something went wrong. Please try again or reach out via LinkedIn.
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="mint-glow"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.09 0.018 240)", background: formState === "submitting" ? `${t.mint}88` : t.mint, border: "none", padding: "1rem 2rem", borderRadius: "2px", cursor: formState === "submitting" ? "not-allowed" : "none", transition: "opacity 0.2s ease, transform 0.2s ease", marginTop: "0.5rem" }}
                      onMouseEnter={(e) => { if (formState !== "submitting") { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      {formState === "submitting" ? (
                        <>
                          <span style={{ display: "inline-block", width: "0.85rem", height: "0.85rem", borderRadius: "50%", borderWidth: "2px", borderStyle: "solid", borderColor: "oklch(0.09 0.018 240)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                          Sending…
                        </>
                      ) : (
                        <>Send Message <span style={{ fontSize: "1rem" }}>→</span></>
                      )}
                    </button>

                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", color: t.textDim, textAlign: "center" }}>
                      Your details are used only to respond to your message.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
