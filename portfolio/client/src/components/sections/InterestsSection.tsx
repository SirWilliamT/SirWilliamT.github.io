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
    title: "Prop Building: ESB Lightsaber",
    description: "One of my favorite projects was building a replica of Luke Skywalker's lightsaber from Star Wars: The Empire Strikes Back. I designed the internal structure in Fusion 360, 3D printed the components, and assembled the electronics to create a fully functional prop with light and sound effects. The housing is a Graflex replica kit that I used as a base for the build.",
    tags: ["Electronics", "3D Printing", "Fusion 360", "Prop Building"],
    color: "mint",
    media: [
      { url: "/media/maker/lightsaber_1.jpg", type: "image", caption: "Fusion 360 lightsaber internals design" },
      { url: "/media/maker/lightsaber_2.jpg", type: "image", caption: "Lightsaber internal wiring" },
      { url: "/media/maker/lightsaber_3.jpg", type: "image", caption: "Lightsaber housing assembly" },
      { url: "/media/maker/lightsaber_4.jpg", type: "image", caption: "Neopixel wiring for light tube" },
      { url: "/media/maker/lightsaber_5.mp4", type: "video", caption: "Lightsaber functionality demonstration" },
    ],
  },
  {
    id: "int2", icon: "⬡",
    title: "Prop Building: NH TIE Fighter Pilot",
    description: "I built a full costume of a TIE Fighter Pilot from Star Wars: A New Hope. The helmet is fiberglass from a screen accurate mold. Armor is also fiberglass and came uncut and unpainted. Armor and helmet were primed by me and painted in an autobody shop. Chest box was designed in Blender by me and 3D printed in parts.",
    tags: ["3D Printing", "Blender", "Fiberglass", "Prop Building", "Painting", "Cosplay"],
    color: "violet",
    media: [
      { url: "/media/maker/tiefighterpilot_6.jpg", type: "image", caption: "Cut fiberglass cast of the chest plate" },
      { url: "/media/maker/tiefighterpilot_1.jpg", type: "image", caption: "Prepping armor for priming" },
      { url: "/media/maker/tiefighterpilot_2.jpg", type: "image", caption: "Prepped helmet for priming" },
      { url: "/media/maker/tiefighterpilot_3.jpg", type: "image", caption: "Primed helmet and armor pieces" },
      { url: "/media/maker/tiefighterpilot_4.jpg", type: "image", caption: "Designed and 3D printed helmet vents" },
      { url: "/media/maker/tiefighterpilot_5.jpg", type: "image", caption: "Finished TIE Fighter Pilotcostume" },
    ],
  },
  {
    id: "int3", icon: "◎",
    title: "Makeup: Palpatine Sith Transformation",
    description: "This was a bit of fun for Halloween many years ago. I transformed myself into Emporer Palpatine from Star Wars using prosthetic makeup. I sculpted the facial prosthetics in clay, created molds, and cast them in silicone. I then applied the prosthetics and used makeup to complete the transformation. Robe clasp was sculpted by hand.",
    tags: ["Prosthetics", "Makeup Artistry", "Sculpting", "Cosplay"],
    color: "teal",
    media: [
      { url: "/media/maker/palpatine_1.jpg", type: "image", caption: "Beginning the transformation" },
      { url: "/media/maker/palpatine_2.jpg", type: "image", caption: "Completed Sith transformation" },
    ],
  },
  {
    id: "int4", icon: "▦",
    title: "Prop Building: Stormtrooper Neck Seal",
    description: "This neck seal was designed and sewn by me for a custom Stormtrooper costume build. I designed the pattern based on reference images, cut the fabric, and sewed it together to create a snug-fitting neck seal that completes the look of the Stormtrooper armor.",
    tags: ["Sewing", "Fabrics", "Cosplay"],
    color: "amber",
    media: [
      { url: "/media/maker/stormtrooper_1.jpg", type: "image", caption: "Finished neck seal" },
    ],
  },
  {
    id: "int5", icon: "◉",
    title: "Ornamental: Cat Memorial Ornament",
    description: "When our cat, Miu Miu, died at 19 years of age, I was devistated. To memorialize her, I designed and 3D printed this ornament of her likeness doing what she liked best... sleeping in front of the fireplace next to the Christmas tree. The cat is the switch to turn on the LED lights by sliding her across the floor.",
    tags: ["3D Printing", "Electronics"],
    color: "orange",
    media: [
      { url: "/media/maker/cat_ornament_1.jpg", type: "image", caption: "Partial 3D print progress" },
      { url: "/media/maker/cat_ornament_2.jpg", type: "image", caption: "Internal wiring for LED lights" },
      { url: "/media/maker/cat_ornament_3.jpg", type: "image", caption: "Finished cat memorial ornament" },
    ],
  },
  {
    id: "int6", icon: "⬢",
    title: "Woodwork: Cat \"House\" Door",
    description: "Created a custom cat door for a storage space beneath our stairs. I designed the door to look like the facade of a multi-story house, complete with windows and a door. I cut the pieces from plywood, assembled them, and painted (with some intentional marks for character) the finished product to create a whimsical entrance for our cat.",
    tags: ["Woodwork", "Prop Building", "Painting"],
    color: "mintLight",
    media: [
      { url: "/media/maker/cat_door_1.jpg", type: "image", caption: "Cut out windows and cat door" },
      { url: "/media/maker/cat_door_2.jpg", type: "image", caption: "Adding in millwork and decorative elements" },
      { url: "/media/maker/cat_door_3.jpg", type: "image", caption: "Finished cat door with decorative touches" },
      { url: "/media/maker/cat_door_4.jpg", type: "image", caption: "Inside view of platforms for window viewing" },
      { url: "/media/maker/cat_door_5.jpg", type: "image", caption: "A picture of the residents" },
    ],
  },
  {
    id: "int7", icon: "◈",
    title: "Prop Building: Papier-mâché Masks",
    description: "Masks have fascinated me since I was a child. I enjoyed making paper masks or carving them out of wood. In my late mid-to-late 20s, I got back into making masks, but took the time to research how to make them using the Venetian style of mask making. I started with regular paper, but eventually moved to using carta lana (a wool paper used by Venetian mask makers). I've sold several of my masks to collectors and to friends around the world.",
    tags: ["Venetian Masks", "Masks", "Papier-mâché", "Prop Building", "Sculpy"],
    color: "mint",
    media: [
      { url: "/media/maker/masks_1.jpg", type: "image", caption: "Anubis Mask: clay > paper > painted" },
      { url: "/media/maker/masks_2.jpg", type: "image", caption: "Pharaoh Mask: with baked sculpy ornamentation" },
      { url: "/media/maker/masks_3.jpg", type: "image", caption: "Liberty Mask: Commissioned piece" },
      { url: "/media/maker/masks_4.jpg", type: "image", caption: "Art Deco Hawk Mask: Won People's Choice Award" },
      { url: "/media/maker/masks_5.jpg", type: "image", caption: "Colombina Mask: Made for my spouse "},
      { url: "/media/maker/masks_6.jpg", type: "image", caption: "Various masks I made on display" },
    ],
  },
  {
    id: "int8", icon: "⬡",
    title: "Other Various Interests",
    description: "Making is in my DNA, and I have a wide range of interests that all feed into each other. Everything from cooking to LEGO to puppetry informs how I approach problems and think about design. I find that exploring different mediums and disciplines keeps my creativity sharp and allows me to bring fresh perspectives to my work.",
    tags: ["Custom Builds", "Prototyping", "Creativity", "LEGO", "Cooking", "Muppets", "3D Printing", "Woodwork"],
    color: "violet",
    media: [
      { url: "/media/maker/lego_1.jpg", type: "image", caption: "One of my mindstorm creations" },
      { url: "/media/maker/lego_2.jpg", type: "image", caption: "Custom build entry at LEGO Insider Tour contest" },
      { url: "/media/maker/muppet_1.jpg", type: "image", caption: "From scratch and custom Whatnot Muppet" },
      { url: "/media/maker/muppet_2.jpg", type: "image", caption: "Preparing for a kids puppet show" },
      { url: "/media/maker/muppet_3.jpg", type: "image", caption: "Muppet performance" },
      { url: "/media/maker/cooking_1.jpg", type: "image", caption: "Making Guiness donuts" },
      { url: "/media/maker/props_1.jpg", type: "image", caption: "A prop I made for a D&D-themed room" },
      { url: "/media/maker/building_1.jpg", type: "image", caption: "Replacing a deck" },
      { url: "/media/maker/ornament_1.jpg", type: "image", caption: "Custom 2020 ornament" },
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
          style={{ position: "fixed", top: "3.5rem", right: "3.5rem", background: "none", border: `1px solid ${t.border}`, color: t.textSecondary, width: "36px", height: "36px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", cursor: "none", transition: "all 0.2s ease", zIndex: 102 }}
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
