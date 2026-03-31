/**
 * InterestsSection — "Liquid Precision" Design System
 * Interests/hobbies grid. Clicking a card slides in a full-height
 * detail panel from the right (same spring-animated drawer as Experience).
 * Theme-aware via useTokens().
 */

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTokens, ThemeTokens } from "@/lib/theme-tokens";

const getInterestColor = (color: string, t: ThemeTokens) => t[color as keyof ThemeTokens];

type Interest = {
  id: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  media: Array<{
    url: string;
    type: "image" | "video";
    caption?: string;
  }>;
};

const interests: Interest[] = [
  {
    id: "int1", icon: "◈",
    title: "3D Printing & Fabrication",
    description: "Turning digital designs into physical objects is one of the most satisfying loops in making. I run an FDM and resin setup for rapid prototyping, functional parts, and experimental forms — bridging the gap between screen and hand.",
    tags: ["FDM", "Resin", "CAD", "Fusion 360", "Post-Processing"],
    color: "mint",
    media: [
      { url: "/media/horizon-workrooms.jpg", type: "image", caption: "FDM printer in action" },
      { url: "/media/ms_dewa.mp4", type: "video", caption: "Resin printed model" },
      { url: "/media/ms_daimler.jpg", type: "image", caption: "Time-lapse of printing process" },
    ],
  },
  {
    id: "int2", icon: "⬡",
    title: "Electronics & Making",
    description: "Building custom circuits and microcontroller projects is where software meets the physical world. From simple LED controllers to complex sensor arrays, I enjoy the problem-solving that comes with hardware constraints.",
    tags: ["Arduino", "ESP32", "PCB Design", "Sensors", "BLE", "IoT"],
    color: "violet",
    media: [
      { url: "/media/horizon-workrooms.jpg", type: "image", caption: "Custom PCB design" },
      { url: "/media/ms_dewa.mp4", type: "video", caption: "Arduino prototype" },
      { url: "/media/ms_daimler.jpg", type: "image", caption: "Circuit testing demonstration" },
    ],
  },
  {
    id: "int3", icon: "◎",
    title: "Generative Art & Code",
    description: "Exploring the intersection of algorithms and aesthetics. Writing generative sketches in p5.js and Processing, experimenting with shader-based visuals, and building systems that produce unexpected beauty from simple rules.",
    tags: ["p5.js", "GLSL", "Processing", "TouchDesigner", "Creative Code"],
    color: "teal",
    media: [
      { url: "/media/horizon-workrooms.jpg", type: "image", caption: "Generative art piece" },
      { url: "/media/ms_dewa.mp4", type: "video", caption: "Animated generative sketch" },
      { url: "/media/ms_daimler.jpg", type: "image", caption: "Shader visualization" },
    ],
  },
  {
    id: "int4", icon: "▦",
    title: "Industrial Design",
    description: "Studying how objects are made, used, and experienced informs every prototype I build. I follow material science, manufacturing processes, and product design case studies closely — understanding constraints makes better design.",
    tags: ["Materials", "DFM", "Ergonomics", "Manufacturing", "Product Design"],
    color: "amber",
    media: [
      { url: "/media/horizon-workrooms.jpg", type: "image", caption: "Product design sketches" },
      { url: "/media/ms_dewa.mp4", type: "video", caption: "Manufacturing facility" },
      { url: "/media/ms_daimler.jpg", type: "image", caption: "Design process walkthrough" },
    ],
  },
  {
    id: "int5", icon: "◉",
    title: "Photography & Visual Storytelling",
    description: "Photography sharpens my eye for detail, light, and spatial relationships — skills that translate directly into better prototype presentation and visual communication. I document process as much as final outcomes.",
    tags: ["Product Photography", "Composition", "Lighting", "Lightroom"],
    color: "orange",
    media: [
      { url: "/media/horizon-workrooms.jpg", type: "image", caption: "Product photography setup" },
      { url: "/media/ms_dewa.mp4", type: "video", caption: "Studio lighting" },
      { url: "/media/ms_daimler.jpg", type: "image", caption: "Photography timelapse" },
    ],
  },
  {
    id: "int6", icon: "⬢",
    title: "Interaction Design Research",
    description: "Reading papers, attending talks, and experimenting with novel input modalities — from tangible interfaces to voice and gesture-based interactions. Staying at the frontier of HCI research directly informs what I prototype.",
    tags: ["HCI", "Tangible UI", "Gesture", "Research", "CHI", "UIST"],
    color: "mintLight",
    media: [
      { url: "/media/horizon-workrooms.jpg", type: "image", caption: "Gesture interface prototype" },
      { url: "/media/ms_dewa.mp4", type: "video", caption: "Tangible UI demonstration" },
      { url: "/media/ms_daimler.jpg", type: "image", caption: "Research setup" },
    ],
  },
];

function MediaCarousel({ media, interestColor }: { media: Interest['media']; interestColor: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = useTokens();

  useEffect(() => {
    if (media.length <= 1 || isHovered) return;

    const currentMedia = media[currentIndex];
    
    if (currentMedia.type === 'video') {
      // For videos, wait for the video to end
      const videoElement = videoRef.current;
      if (videoElement) {
        const handleVideoEnd = () => {
          setCurrentIndex((prev) => (prev + 1) % media.length);
        };
        
        videoElement.addEventListener('ended', handleVideoEnd);
        return () => {
          videoElement.removeEventListener('ended', handleVideoEnd);
        };
      }
    } else {
      // For images, use the timer
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [media.length, isHovered, currentIndex, media]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden"
        style={{ height: "200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {media.map((item, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            {item.type === "video" ? (
              <video
                ref={index === currentIndex ? videoRef : null}
                src={item.url}
                autoPlay
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <img
                src={item.url}
                alt={item.caption || `Media ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x200?text=Image+Coming+Soon"; }}
              />
            )}
          </div>
        ))}

        {/* Navigation dots */}
        {media.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {media.map((_, index) => {
              const isActive = index === currentIndex;
              const color = getInterestColor(interestColor, t);
              return (
                <button
                  key={`dot-${index}`}
                  onClick={() => goToSlide(index)}
                  className="w-2 h-2 rounded-full transition-all duration-200 border border-white/20"
                  style={{
                    backgroundColor: isActive ? color : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isActive ? `0 0 8px ${color}40` : 'none',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Media counter */}
        {media.length > 1 && (
          <div
            className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: t.textPrimary,
            }}
          >
            {currentIndex + 1}/{media.length}
          </div>
        )}
      </div>

      {/* Caption */}
      {currentMedia?.caption && (
        <div
          className="text-center mt-2 px-2"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            color: t.textSecondary,
            lineHeight: 1.4,
          }}
        >
          {currentMedia.caption}
        </div>
      )}
    </div>
  );
}

function GalleryModal({ interests, onClose }: { interests: Interest[]; onClose: () => void }) {
  const t = useTokens();
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "oklch(0.05 0.01 240 / 0.8)", backdropFilter: "blur(8px)", zIndex: 100, cursor: "none" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        style={{ position: "fixed", inset: "2rem", background: t.panelBg, border: `1px solid ${t.border}`, zIndex: 101, overflowY: "auto", borderRadius: "4px", padding: "2rem" }}
      >
        <button onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: `1px solid ${t.border}`, color: t.textSecondary, width: "36px", height: "36px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", cursor: "none", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = t.mint; e.currentTarget.style.borderColor = `${t.mint}55`; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
          aria-label="Close gallery"
        >✕</button>

        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "2rem" }}>
          Interests Gallery
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interests.map((interest, i) => (
            <motion.div
              key={interest.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ position: "relative", overflow: "hidden", borderRadius: "4px", border: `1px solid ${t.border}`, background: t.surface }}
            >
              <MediaCarousel media={interest.media} interestColor={interest.color} />
              <div style={{ padding: "1rem" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", color: getInterestColor(interest.color, t), marginBottom: "0.5rem" }}>
                  {interest.icon}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", color: t.textPrimary, marginBottom: "0.5rem" }}>
                  {interest.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.6, color: t.textSecondary, marginBottom: "1rem" }}>
                  {interest.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {interest.tags.slice(0, 3).map((tag) => (
                    <span key={tag} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: getInterestColor(interest.color, t), border: `1px solid ${getInterestColor(interest.color, t)}44`, padding: "0.2rem 0.6rem", borderRadius: "2px" }}>
                      {tag}
                    </span>
                  ))}
                  {interest.tags.length > 3 && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDim, padding: "0.2rem 0.4rem" }}>
                      +{interest.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}



export default function InterestsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showGallery, setShowGallery] = useState(false);
  const t = useTokens();

  return (
    <section id="interests" ref={ref} className="relative py-32 overflow-hidden" style={{ background: t.bg }}>
      <span className="section-number" style={{ right: "-2rem", top: "2rem", color: t.sectionNumber }}>04</span>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-4"
        >
          <span className="accent-line" style={{ background: t.mint }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.mint }}>
            Interests
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: t.textPrimary, marginBottom: "1rem" }}
        >
          What drives me{" "}
          <span className="text-gradient">beyond the brief</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: t.textSecondary, maxWidth: "560px", marginBottom: "3rem" }}
        >
          The things I explore outside of work directly inform how I approach problems.
          Making, experimenting, and researching are not hobbies — they're how I stay sharp.{" "}
          <span style={{ color: t.textDim, fontStyle: "italic" }}>Click below to explore my interests gallery.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => setShowGallery(true)}
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            padding: "3rem", borderRadius: "4px",
            cursor: "none",
            position: "relative", overflow: "hidden",
            maxWidth: "600px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "2rem", color: t.mint, marginBottom: "1rem" }}>
              ◈ ⬡ ◎ ▦ ◉ ⬢
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1.5rem", color: t.textPrimary, marginBottom: "1rem" }}>
              Explore My Interests Gallery
            </h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: t.textSecondary, marginBottom: "2rem" }}>
              View images and videos showcasing my creative pursuits and technical explorations.
            </p>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: t.mint }}>
              Click to Open Gallery →
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showGallery && <GalleryModal interests={interests} onClose={() => setShowGallery(false)} />}
      </AnimatePresence>
    </section>
  );
}
