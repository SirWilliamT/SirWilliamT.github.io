/**
 * LoadingScreen — "Liquid Precision" Design System
 * Brief intro animation that plays on first load.
 * Theme-aware via useTokens().
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTokens } from "@/lib/theme-tokens";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const t = useTokens();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            background: t.bg,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "2rem",
              color: t.textPrimary,
              letterSpacing: "-0.03em",
            }}
          >
            W<span style={{ color: t.mint }}>.</span>
          </motion.div>

          {/* Progress bar */}
          <div
            style={{
              width: "120px",
              height: "1px",
              background: t.surface2,
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${t.mint}, ${t.violet})`,
                borderRadius: "1px",
              }}
            />
          </div>

          {/* Label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: t.textDim,
            }}
          >
            Loading Portfolio
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
