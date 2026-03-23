# William Portfolio — Design Brainstorm

## Three Design Approaches

---

<response>
<probability>0.07</probability>
<text>

### Idea A — "Tactile Brutalism Meets Digital Craft"

**Design Movement:** Post-Digital Brutalism / New Craft

**Core Principles:**
1. Raw structure exposed — grid lines, borders, and scaffolding are part of the aesthetic
2. Typographic tension — oversized display type collides with fine-grain body copy
3. Monochromatic base disrupted by a single warm amber accent
4. Intentional imperfection — slight rotations, offset elements, hand-drawn feel

**Color Philosophy:**
- Background: `#0E0E0E` (near-black, warm undertone)
- Surface: `#1A1A1A` (card/panel)
- Foreground: `#F2EDE4` (warm off-white)
- Accent: `#E8A838` (amber — evokes craft, warmth, tools)
- Muted: `#5A5550` (warm gray)
- The amber is used sparingly — only for interactive states, skill bars, and key labels

**Layout Paradigm:**
- Asymmetric column grid — 3-column with intentional white-space breaks
- Hero: full-bleed with oversized rotated name, stacked left
- Sections break the grid deliberately — some bleed edge-to-edge
- Experience: slides in from the right as a full-height drawer panel

**Signature Elements:**
1. Thin horizontal rule lines with monospace labels (like engineering drawings)
2. Skill bars rendered as segmented tape/ruler marks
3. Cursor-following amber dot that trails behind mouse movement

**Interaction Philosophy:**
- Hover states reveal hidden text or shift element positions
- Scroll triggers staggered text reveals (lines slide up from below)
- Experience drawer slides in with spring physics

**Animation:**
- GSAP ScrollTrigger for section reveals (stagger 0.08s per element)
- Hero: name letters animate in with a stagger scramble effect
- Shader: subtle grain/noise texture overlay on hero background
- Skill bars fill left-to-right on scroll entry

**Typography System:**
- Display: `Syne` (700/800) — geometric, slightly eccentric
- Body: `DM Mono` (400) — monospace, technical, readable
- Labels: `DM Mono` (400) uppercase with letter-spacing

</text>
</response>

---

<response>
<probability>0.06</probability>
<text>

### Idea B — "Liquid Precision" ✅ SELECTED

**Design Movement:** New Minimalism / Kinetic Craft

**Core Principles:**
1. Dark canvas with surgical precision — every element has a reason to exist
2. Motion as material — animations are not decoration but communication
3. A single electric accent color that feels alive against near-black
4. Generous negative space — content breathes, nothing crowds

**Color Philosophy:**
- Background: `#080B10` (deep navy-black — not pure black, has depth)
- Surface: `#0F1520` (card/panel — slightly lighter, blue-tinted)
- Foreground: `#E8EDF5` (cool off-white — clean, not harsh)
- Accent: `#4DFFC3` (electric mint/teal — creative energy, modern, not neon-aggressive)
- Secondary Accent: `#7B61FF` (soft violet — for gradients, hover states)
- Muted: `#3A4560` (blue-gray — subtle borders, dividers)
- The mint accent is used for: skill bar fills, active nav dots, CTA buttons, hover underlines
- Gradient: mint → violet used in hero shader and section dividers

**Layout Paradigm:**
- Single-column scroll with full-viewport sections
- Hero: left-aligned, large display type, shader canvas fills right half
- Navigation: fixed left-side vertical nav with section dots
- Experience: slides in from the right as an overlay panel (full-height, 60% width)
- Skills: two-column grid with animated progress bars
- Interests: horizontal scroll row of cards

**Signature Elements:**
1. Animated WebGL fragment shader in hero — flowing liquid-light gradient (mint + violet)
2. Section numbers in large muted type behind content (01, 02, 03...)
3. Thin accent-colored underline that animates on hover for all interactive text

**Interaction Philosophy:**
- Smooth scroll with momentum
- Hover: text elements shift slightly upward with opacity change
- Experience panel: slides in from right with backdrop blur overlay
- Cursor: custom dot cursor with trailing ring

**Animation:**
- Hero: WebGL shader with time-based fluid motion (GLSL fragment shader)
- Scroll: Framer Motion viewport-triggered reveals (y: 40 → 0, opacity 0 → 1)
- Skill bars: fill animation triggered on scroll entry
- Nav dots: active state transitions with spring
- Experience panel: spring-based slide-in from right

**Typography System:**
- Display: `Space Grotesk` (700) — modern, geometric, slightly quirky
- Body: `Inter` (400/500) — clean, readable (used only for body, not display)
- Accent labels: `Space Mono` (400) — monospace for technical labels, section numbers
- Hierarchy: 72px display → 48px section title → 18px body → 12px label

</text>
</response>

---

<response>
<probability>0.05</probability>
<text>

### Idea C — "Organic Signal"

**Design Movement:** Bio-Digital / Soft Futurism

**Core Principles:**
1. Warm dark background — feels like a workshop at night, not a cold server room
2. Organic shapes and curves contrast with precise technical content
3. Earthy-warm palette with a single electric blue signal accent
4. Content feels discovered, not presented — scroll reveals like peeling back layers

**Color Philosophy:**
- Background: `#12100E` (warm near-black)
- Surface: `#1E1B17` (warm dark brown-gray)
- Foreground: `#F0EAE0` (warm cream)
- Accent: `#2BAAFF` (electric sky blue — signal, clarity, precision)
- Secondary: `#FF6B35` (warm orange — energy, making, craft)
- The blue is used for interactive elements; orange for highlights and skill bars

**Layout Paradigm:**
- Asymmetric with organic blob shapes as section dividers
- Hero: full-bleed with a 3D-like particle field
- Content panels float on the page with subtle shadows
- Experience: expands inline below the timeline entry (accordion style)

**Signature Elements:**
1. SVG blob shapes as section backgrounds (animated with CSS)
2. Particle field in hero that responds to mouse movement
3. Timeline-style experience section with animated connector lines

**Interaction Philosophy:**
- Mouse-reactive hero particles
- Accordion experience entries with smooth height animation
- Skill bars pulse gently on hover

**Animation:**
- Hero: canvas particle system responding to mouse
- Scroll: blur-in reveals (filter: blur(8px) → 0)
- Timeline connector lines draw in on scroll
- Skill bars fill with a liquid pour effect

**Typography System:**
- Display: `Clash Display` (600/700) — editorial, modern
- Body: `Satoshi` (400) — clean, warm
- Labels: `JetBrains Mono` (400) — technical precision

</text>
</response>

---

## Selected Design: **Idea B — "Liquid Precision"**

Deep navy-black canvas, electric mint accent (#4DFFC3), Space Grotesk display type, WebGL fluid shader in hero, Framer Motion scroll reveals, and a right-side slide-in Experience panel.
