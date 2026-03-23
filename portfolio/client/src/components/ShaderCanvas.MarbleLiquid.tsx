/**
 * ShaderCanvas — "Liquid Precision" Design System
 * WebGL GLSL fragment shader: organic flowing ribbons in mint and violet.
 *
 * Technique: multi-layer domain-warped fBm (Inigo Quilez style).
 * The key insight is using the noise output itself to warp the UV coordinates
 * before sampling again — this creates the swirling, ribbon-like structures.
 * Colors are vivid and saturated so ribbons are clearly visible against the dark bg.
 */

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_mouse;

  // ── Value noise (smooth) ───────────────────────────────────────────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // ── Fractal Brownian Motion ────────────────────────────────────────────────
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      v += a * vnoise(p);
      p  = rot * p * 2.1;
      a *= 0.5;
    }
    return v;
  }

  // ── Palette: maps t in [0,1] to mint → teal → violet ────────────────────
  // Hard-coded 3-stop gradient — no cosine, so no accidental reds/oranges.
  vec3 palette(float t) {
    vec3 mint   = vec3(0.30, 1.00, 0.76);  // #4DFFC3
    vec3 teal   = vec3(0.08, 0.65, 0.60);  // mid teal
    vec3 violet = vec3(0.48, 0.38, 1.00);  // #7B61FF
    if (t < 0.5) {
      return mix(teal, mint, t * 2.0);
    } else {
      return mix(mint, violet, (t - 0.5) * 2.0);
    }
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    // Center and correct aspect
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = u_time * 0.15;

    // ── Stage 1: warp UV with fbm ──────────────────────────────────────────
    vec2 q;
    q.x = fbm(p + vec2(0.00, 0.00) + t * 0.5);
    q.y = fbm(p + vec2(5.20, 1.30) + t * 0.4);

    // ── Stage 2: warp again using q ───────────────────────────────────────
    vec2 r;
    r.x = fbm(p + 4.0 * q + vec2(1.70, 9.20) + t * 0.35);
    r.y = fbm(p + 4.0 * q + vec2(8.30, 2.80) + t * 0.30);

    // ── Stage 3: final scalar field ───────────────────────────────────────
    float f = fbm(p + 4.5 * r + t * 0.2);

    // ── Mouse: subtle pull toward cursor ──────────────────────────────────
    vec2 mouse = (u_mouse / u_resolution.xy - 0.5) * vec2(aspect, 1.0);
    float mDist = length(p - mouse);
    f += smoothstep(0.5, 0.0, mDist) * 0.06;

    f = clamp(f, 0.0, 1.0);

    // ── Color mapping ─────────────────────────────────────────────────────
    // Use the palette for the ribbon color, then boost brightness
    vec3 ribbonColor = palette(f * 1.2 + t * 0.05);

    // The dark background: only show color where f is above a threshold
    // This creates distinct ribbon-like structures rather than a uniform wash
    float ribbonMask = smoothstep(0.30, 0.65, f);
    float glowMask   = smoothstep(0.20, 0.55, f) * 0.35;

    vec3 bg  = vec3(0.031, 0.043, 0.063); // #080B10
    vec3 col = bg;

    // Main ribbons
    col = mix(col, ribbonColor * 1.4, ribbonMask);
    // Soft glow halo around ribbons
    col += ribbonColor * glowMask * 0.5;

    // Slight blue-green boost to keep mint/teal reading true
    col.r = clamp(col.r * 0.85, 0.0, 1.0);

    // ── Vignette: fade edges to deep navy ─────────────────────────────────
    float vig = 1.0 - dot(uv * 2.0 - 1.0, (uv * 2.0 - 1.0) * 0.5);
    vig = clamp(vig, 0.0, 1.0);
    col = mix(bg * 0.6, col, vig);

    // ── Film grain ────────────────────────────────────────────────────────
    float grain = (fract(sin(dot(uv + u_time * 0.001, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.015;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

interface ShaderCanvasProps {
  className?: string;
}

export default function ShaderCanvas({ className = "" }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vert = compile(gl.VERTEX_SHADER,   VERTEX_SHADER);
    const frag = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime       = gl.getUniformLocation(prog, "u_time");
    const uResolution = gl.getUniformLocation(prog, "u_resolution");
    const uMouse      = gl.getUniformLocation(prog, "u_mouse");

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: canvas.clientHeight - (e.clientY - rect.top),
      };
    };
    window.addEventListener("mousemove", onMove);

    const t0 = performance.now();
    function render() {
      const elapsed = (performance.now() - t0) / 1000;
      gl!.uniform1f(uTime,       elapsed);
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouse,      mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
