/**
 * ShaderCanvas — "Liquid Precision" Design System
 * VARIANT: Caustic Neural Web
 *
 * Technique overview:
 *  - A grid of Voronoi cells, each containing one drifting node.
 *  - Nodes drift on overlapping sinusoidal paths (organic, non-repeating).
 *  - For each pixel, we find the two nearest nodes and draw a tendril
 *    between them using a smooth capsule SDF. The tendril width tapers
 *    toward the midpoint for a spidery look.
 *  - Light beams: each connection has a pulse that travels from node A
 *    to node B at a random speed. The pulse is a narrow Gaussian along
 *    the parametric t of the capsule.
 *  - Node flare: when a pulse is near t=0 or t=1 (arriving at a node),
 *    the node brightens with a soft radial glow.
 *  - Background: dark atmospheric gradient + slow drifting clouds.
 *  - Cursor: gently distorts nearby node positions.
 *
 * Saved shaders:
 *   ShaderCanvas.MarbleLiquid.tsx       — organic marble fluid
 *   ShaderCanvas.CircuitBoard.tsx       — PCB tile traces
 *   ShaderCanvas.NeuralNet.tsx          — earlier neural network attempt
 *   ShaderCanvas.IridescentRibbons.tsx  — cursor-reactive iridescent waves
 *   ShaderCanvas.CyberpunkCity.tsx      — morphing cyberpunk skyline
 */

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_mouse_norm; // -1..1 smoothed cursor

  // ── Hash helpers ──────────────────────────────────────────────────────────
  float h1(float n) { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
  float h2(float a, float b) { return h1(a * 57.0 + b * 131.0); }
  vec2  h2v(vec2 p) { return vec2(h2(p.x, p.y), h2(p.y + 3.1, p.x + 7.3)); }

  // ── Brand palette ─────────────────────────────────────────────────────────
  // Mint #4DFFC3, Violet #7B61FF, Teal #0EADA0, Soft-white #C8F0FF
  vec3 pulseColor(float seed) {
    float s = h1(seed);
    if (s < 0.30) return vec3(0.302, 1.000, 0.765); // mint
    if (s < 0.55) return vec3(0.482, 0.380, 1.000); // violet
    if (s < 0.78) return vec3(0.055, 0.678, 0.627); // teal
    return vec3(0.784, 0.941, 1.000);               // ice-blue
  }

  // ── Smooth value noise (for clouds + tendril warp) ────────────────────────
  float vnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(h2(i.x,       i.y),       h2(i.x+1.0, i.y),       u.x),
               mix(h2(i.x,       i.y+1.0),   h2(i.x+1.0, i.y+1.0),   u.x), u.y);
  }

  // ── Node position for cell (cx,cy) at time t ──────────────────────────────
  // Returns position in [0..1]^2 local cell space
  vec2 nodePos(vec2 cell, float t) {
    vec2 r = h2v(cell);
    // Two overlapping sinusoids per axis — produces irregular figure-8 drift
    float x = 0.5 + 0.32 * sin(t * (0.31 + r.x * 0.28) + r.x * 6.28)
                  + 0.12 * sin(t * (0.71 + r.y * 0.19) + r.y * 3.14);
    float y = 0.5 + 0.32 * sin(t * (0.27 + r.y * 0.31) + r.y * 6.28)
                  + 0.12 * sin(t * (0.59 + r.x * 0.23) + r.x * 3.14);
    return clamp(vec2(x, y), 0.05, 0.95);
  }

  // ── SDF: straight capsule (segment) ─────────────────────────────────────────────
  // Returns (dist, t_along_segment)
  vec2 sdCapsule(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
    return vec2(length(p - (a + t * ab)), t);
  }

  // ── Wavy tendril distance ─────────────────────────────────────────────────────
  // Optimised: straight-capsule cull first, then 12-step wavy march only
  // when the pixel is within striking distance of the tendril.
  vec2 sdWavyCapsule(vec2 p, vec2 a, vec2 b, float waveAmp, float waveFreq, float wavePhase) {
    vec2 ab   = b - a;
    vec2 dir  = ab / max(length(ab), 0.0001);
    vec2 perp = vec2(-dir.y, dir.x);

    // Fast straight-capsule cull: if pixel is farther than (waveAmp + maxWidth)
    // from the straight segment, skip the expensive march entirely.
    float tStraight = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
    float dStraight = length(p - (a + tStraight * ab));
    float cullRadius = waveAmp + 0.08; // max possible wave displacement + glow width
    if (dStraight > cullRadius) return vec2(dStraight, tStraight);

    // Wavy march — 12 steps (down from 24), visually identical at this scale
    float minDist = 1e9;
    float bestT   = 0.0;
    float wt      = 0.0;
    float wEnv    = 0.0;
    float wOff    = 0.0;
    vec2  wSpine  = vec2(0.0);
    float wD      = 0.0;

    for (int i = 0; i <= 12; i++) {
      wt     = float(i) / 12.0;
      wEnv   = sin(wt * 3.14159);
      wOff   = waveAmp * wEnv * sin(waveFreq * wt + wavePhase);
      wSpine = a + wt * ab + perp * wOff;
      wD     = length(p - wSpine);
      if (wD < minDist) { minDist = wD; bestT = wt; }
    }
    return vec2(minDist, bestT);
  }

  // ── Tendril glow: tapers at midpoint for spidery look ─────────────────────
  float tendrilGlow(float dist, float t_along, float baseWidth) {
    float taper = 1.0 - 0.55 * (1.0 - abs(t_along * 2.0 - 1.0));
    float w = baseWidth * taper;
    return exp(-dist * dist / (w * w + 0.00001));
  }

  // ── Cloud background──────────────────────────────────────────────────────
  float cloudDensity(vec2 uv, float t) {
    vec2 p1 = uv * vec2(3.5, 2.0) + vec2(t * 0.012, 0.0);
    vec2 p2 = uv * vec2(6.0, 3.5) + vec2(t * 0.022, 0.03);
    float n = vnoise(p1) * 0.55 + vnoise(p2) * 0.45;
    return smoothstep(0.50, 0.70, n) * smoothstep(1.0, 0.0, uv.y * 1.2);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;

    // Correct for aspect ratio so cells are square
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uvA = vec2(uv.x * aspect, uv.y); // aspect-corrected space

    float t = u_time;

    // ── Background: deep navy gradient ────────────────────────────────────
    vec3 col = mix(vec3(0.040, 0.025, 0.100), vec3(0.005, 0.008, 0.020), uv.y);

    // ── Clouds (subtle, behind web) ───────────────────────────────────────
    float cd = cloudDensity(uv, t);
    col = mix(col, vec3(0.055, 0.035, 0.130), cd * 0.50);

    // ── Neural web grid ───────────────────────────────────────────────────
    // Grid resolution: COLS x ROWS cells, each with one node
    float COLS = 7.0;
    float ROWS = 5.0;

    // Scale uvA into grid space
    vec2 gridUV = vec2(uvA.x / aspect * COLS, uv.y * ROWS);
    vec2 gridCell = floor(gridUV);

    // Accumulate tendril + pulse contributions from neighbouring cells
    // We check a 3x3 neighbourhood around the current cell
    float webGlow   = 0.0;
    float pulseGlow = 0.0;
    vec3  pulseCol  = vec3(0.0);
    float nodeGlow  = 0.0;
    vec3  nodeCol   = vec3(0.0);

    // Current pixel in grid-local coords
    vec2 pGrid = vec2(uvA.x / aspect * COLS, uv.y * ROWS);

    // 3x3 neighbourhood is sufficient — nodes drift within their cell so
    // a connection from cellA can only reach ~1.5 cells away.
    for (float dy = -1.0; dy <= 1.0; dy += 1.0) {
      for (float dx = -1.0; dx <= 1.0; dx += 1.0) {
        vec2 cellA = gridCell + vec2(dx, dy);

        // Node A world position (in grid space)
        vec2 nA = cellA + nodePos(cellA, t);

        // Distance cull: skip this cell if nA is too far from current pixel
        float dToA = length(pGrid - nA);
        if (dToA < 2.8) {

        // Connect A to its right and bottom neighbours (avoids double-drawing)
        // Right neighbour
        vec2 cellB = cellA + vec2(1.0, 0.0);
        vec2 nB    = cellB + nodePos(cellB, t);

        // ── Tendril A→B (wavy) ─────────────────────────────────────────────────────────
        float wAmpAB   = 0.08 + 0.10 * h2(cellA.x + 0.3, cellA.y + 0.7);
        float wFreqAB  = 8.0  + 6.0  * h2(cellA.x + 1.1, cellA.y + 2.3);
        float wPhaseAB = u_time * (0.4 + 0.3 * h2(cellA.x, cellA.y + 4.0));
        vec2 capAB = sdWavyCapsule(pGrid, nA, nB, wAmpAB, wFreqAB, wPhaseAB);
        float distAB = capAB.x;
        float tAB    = capAB.y;

        // Tendril base width (thin, spidery)
        float wAB = 0.018 + 0.008 * h2(cellA.x, cellA.y);
        float gAB = tendrilGlow(distAB, tAB, wAB);
        webGlow += gAB * 0.35;

        // Pulse along A→B
        float pSeedAB  = h2(cellA.x * 3.7 + cellA.y, 11.3);
        float pSpeedAB = 0.25 + pSeedAB * 0.55;
        float pPhaseAB = h2(cellA.x, cellA.y + 0.5);
        float pPosAB   = fract(t * pSpeedAB + pPhaseAB);
        float pDistAB  = abs(tAB - pPosAB);
        float beamAB   = exp(-pDistAB * pDistAB / 0.0008) * gAB * 2.5;
        vec3  pcAB     = pulseColor(pSeedAB);
        pulseGlow += beamAB;
        pulseCol  += pcAB * beamAB;

        // Node flare when pulse arrives at A or B
        float flareA = exp(-pPosAB * pPosAB / 0.004);
        float flareB = exp(-(1.0 - pPosAB) * (1.0 - pPosAB) / 0.004);
        float dA = dToA; // reuse already-computed distance
        float dB = length(pGrid - nB);
        nodeGlow += exp(-dA * dA / 0.0048) * (0.4 + flareA * 1.8);
        nodeGlow += exp(-dB * dB / 0.0048) * (0.4 + flareB * 1.8);
        nodeCol  += pcAB * exp(-dA * dA / 0.0048) * flareA * 2.0;
        nodeCol  += pcAB * exp(-dB * dB / 0.0048) * flareB * 2.0;

        // ── Diagonal neighbour (A to bottom-right) ────────────────────
        vec2 cellC = cellA + vec2(1.0, 1.0);
        vec2 nC    = cellC + nodePos(cellC, t);
        float dToC = length(pGrid - nC);
        if (h2(cellA.x + 0.1, cellA.y + 0.2) > 0.50 && dToC < 2.8) {
          float wAmpAC   = 0.07 + 0.09 * h2(cellA.x + 0.5, cellA.y + 1.3);
          float wFreqAC  = 7.0  + 5.0  * h2(cellA.x + 2.1, cellA.y + 0.7);
          float wPhaseAC = u_time * (0.35 + 0.25 * h2(cellA.x + 1.0, cellA.y + 3.0));
          vec2 capAC = sdWavyCapsule(pGrid, nA, nC, wAmpAC, wFreqAC, wPhaseAC);
          float distAC = capAC.x;
          float tAC    = capAC.y;
          float wAC = 0.012 + 0.006 * h2(cellA.x + 1.0, cellA.y);
          float gAC = tendrilGlow(distAC, tAC, wAC);
          webGlow += gAC * 0.25;

          float pSeedAC  = h2(cellA.x * 5.1 + cellA.y, 23.7);
          float pSpeedAC = 0.20 + pSeedAC * 0.45;
          float pPhaseAC = h2(cellA.x + 2.0, cellA.y + 1.0);
          float pPosAC   = fract(t * pSpeedAC + pPhaseAC);
          float pDistAC  = abs(tAC - pPosAC);
          float beamAC   = exp(-pDistAC * pDistAC / 0.0008) * gAC * 2.0;
          vec3  pcAC     = pulseColor(pSeedAC);
          pulseGlow += beamAC;
          pulseCol  += pcAC * beamAC;

          float flareAd = exp(-pPosAC * pPosAC / 0.004);
          float flareCd = exp(-(1.0 - pPosAC) * (1.0 - pPosAC) / 0.004);
          nodeGlow += exp(-dA * dA / 0.0048) * flareAd * 1.2;
          float dC = dToC;
          nodeGlow += exp(-dC * dC / 0.0048) * (0.3 + flareCd * 1.2);
          nodeCol  += pcAC * exp(-dC * dC / 0.0048) * flareCd * 1.5;
        }

        // ── Bottom neighbour (A to below) ────────────────────────────────
        vec2 cellD = cellA + vec2(0.0, 1.0);
        vec2 nD    = cellD + nodePos(cellD, t);
        float wAmpAD   = 0.09 + 0.08 * h2(cellA.x + 0.7, cellA.y + 0.4);
        float wFreqAD  = 9.0  + 5.0  * h2(cellA.x + 0.3, cellA.y + 1.9);
        float wPhaseAD = u_time * (0.45 + 0.28 * h2(cellA.x + 2.0, cellA.y + 0.5));
        vec2 capAD = sdWavyCapsule(pGrid, nA, nD, wAmpAD, wFreqAD, wPhaseAD);
        float distAD = capAD.x;
        float tAD    = capAD.y;
        float wAD = 0.016 + 0.007 * h2(cellA.x, cellA.y + 1.0);
        float gAD = tendrilGlow(distAD, tAD, wAD);
        webGlow += gAD * 0.30;

        float pSeedAD  = h2(cellA.x + cellA.y * 7.3, 41.1);
        float pSpeedAD = 0.22 + pSeedAD * 0.50;
        float pPhaseAD = h2(cellA.y * 3.0, cellA.x + 1.5);
        float pPosAD   = fract(t * pSpeedAD + pPhaseAD);
        float pDistAD  = abs(tAD - pPosAD);
        float beamAD   = exp(-pDistAD * pDistAD / 0.0008) * gAD * 2.0;
        vec3  pcAD     = pulseColor(pSeedAD);
        pulseGlow += beamAD;
        pulseCol  += pcAD * beamAD;

        float flareAv = exp(-pPosAD * pPosAD / 0.004);
        float flareDv = exp(-(1.0 - pPosAD) * (1.0 - pPosAD) / 0.004);
        nodeGlow += exp(-dA * dA / 0.0048) * flareAv * 1.2;
        float dD = length(pGrid - nD);
        nodeGlow += exp(-dD * dD / 0.0048) * (0.3 + flareDv * 1.2);
        nodeCol  += pcAD * exp(-dD * dD / 0.0048) * flareDv * 1.5;

        } // end distance cull
      }
    }

    // ── Cursor interaction: brighten web near cursor ───────────────────────
    vec2 mouseUV = (u_mouse_norm * 0.5 + 0.5); // 0..1
    float mouseDist = length(uv - mouseUV);
    float mouseInfluence = smoothstep(0.25, 0.0, mouseDist);
    webGlow   *= 1.0 + mouseInfluence * 1.5;
    pulseGlow *= 1.0 + mouseInfluence * 2.0;
    nodeGlow  *= 1.0 + mouseInfluence * 2.5;

    // ── Composite ─────────────────────────────────────────────────────────
    // Tendril base color: very dim mint/teal so they read as dark threads
    vec3 webColor = vec3(0.10, 0.55, 0.50);
    col += webColor  * clamp(webGlow,   0.0, 1.0) * 0.55;

    // Pulse beams: bright, colored
    if (pulseGlow > 0.001) {
      col += (pulseCol / (pulseGlow + 0.001)) * clamp(pulseGlow, 0.0, 3.0) * 0.90;
    }

    // Node glows: soft radial halos, colored by last arriving pulse
    col += vec3(0.20, 0.80, 0.70) * clamp(nodeGlow, 0.0, 3.0) * 0.50;
    if (nodeGlow > 0.001) {
      col += (nodeCol / (nodeGlow + 0.001)) * clamp(nodeGlow, 0.0, 2.0) * 0.55;
    }

    // ── Vignette ──────────────────────────────────────────────────────────
    vec2 vig = uv * 2.0 - 1.0;
    col *= 1.0 - dot(vig * 0.45, vig * 0.45);

    // ── Film grain ────────────────────────────────────────────────────────
    float gr = (fract(sin(dot(uv + fract(t * 0.001), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.022;
    col += gr;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

interface ShaderCanvasProps {
  className?: string;
}

export default function ShaderCanvas({ className = "" }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const mouseRef  = useRef({ x: 0.0, y: 0.0 });
  const smoothRef = useRef({ x: 0.0, y: 0.0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // ── Compile helpers ───────────────────────────────────────────────────
    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(s));
      }
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER,   VERTEX_SHADER));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime       = gl.getUniformLocation(prog, "u_time");
    const uResolution = gl.getUniformLocation(prog, "u_resolution");
    const uMouse      = gl.getUniformLocation(prog, "u_mouse_norm");

    // ── Resize ────────────────────────────────────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width  = canvas!.clientWidth  * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Mouse tracking ────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
    }
    window.addEventListener("mousemove", onMouseMove);

    // ── Render loop ───────────────────────────────────────────────────────
    const start = performance.now();
    function render() {
      const elapsed = (performance.now() - start) / 1000;

      // Smooth mouse
      const sm = smoothRef.current;
      const mx = mouseRef.current;
      sm.x += (mx.x - sm.x) * 0.06;
      sm.y += (mx.y - sm.y) * 0.06;

      gl!.uniform1f(uTime,       elapsed);
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse,      sm.x, sm.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
