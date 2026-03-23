/**
 * ShaderCanvas — "Liquid Precision" Design System
 * VARIANT: Iridescent Ribbons (cursor-reactive)
 *
 * Ported from Shadertoy "iridescent ribbons" by evesira (wfsXDl)
 * Original technique: layered 3D ribbon waves with perspective projection.
 * Audio reactivity replaced with smooth cursor tracking.
 * Palette locked to mint (#4DFFC3), violet (#7B61FF), teal (#0EADA0).
 *
 * How cursor reactivity works:
 *   - Mouse XY is smoothed with exponential decay (in JS, passed as uniform)
 *   - u_mouse drives rotateX (vertical tilt) and rotateY (horizontal pan)
 *   - When cursor is still, ribbons gently auto-rotate
 *
 * Saved shaders:
 *   ShaderCanvas.MarbleLiquid.tsx  — organic marble fluid
 *   ShaderCanvas.CircuitBoard.tsx  — PCB tile traces
 *   ShaderCanvas.NeuralNet.tsx     — neural network nodes + tendrils
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
  uniform vec2  u_mouse_norm;  // normalized -1..1 cursor position (smoothed)

  #define PI 3.14159265358979
  // ── Palette: mint / violet / teal ─────────────────────────────────────────────────
  // Cosine palette locked to our brand colors.
  // Outputs vivid mint (#4DFFC3), violet (#7B61FF), teal (#0EADA0)
  vec3 palette(float t) {
    // Mint  (#4DFFC3) = (0.302, 1.000, 0.765)
    // Teal  (#0EADA0) = (0.055, 0.678, 0.627)
    // Violet(#7B61FF) = (0.482, 0.380, 1.000)
    // We interpolate between these 3 stops using cosine.
    // Tuned so: t=0.0 → teal, t=0.4 → mint, t=0.75 → violet
    vec3 a = vec3(0.28, 0.69, 0.80);   // midpoint between all 3
    vec3 b = vec3(0.22, 0.31, 0.20);   // amplitude (tight, no pink)
    vec3 c = vec3(0.60, 0.50, 0.55);   // frequency (slow cycle)
    vec3 d = vec3(0.55, 0.20, 0.65);   // phase
    return clamp(a + b * cos(2.0 * PI * (c * t + d)), 0.0, 1.0);
  }

  // ── Smooth sin ──────────────────────────────────────────────────────
  float _sin(float x) { return sin(x); }

  // ── 3D rotation helpers ───────────────────────────────────────────────────
  vec3 rotateX(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(v.x, c*v.y - s*v.z, s*v.y + c*v.z);
  }
  vec3 rotateY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c*v.x + s*v.z, v.y, -s*v.x + c*v.z);
  }
  vec3 rotateZ(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c*v.x - s*v.y, s*v.x + c*v.y, v.z);
  }

  // ── Perspective projection ────────────────────────────────────────────────
  vec2 project(vec3 xyz, float focalZ) {
    return xyz.xy / (xyz.z + focalZ);
  }

  // ── Single ribbon wave ────────────────────────────────────────────────────
  // xy:       projected 2D coordinate
  // amp:      vertical amplitude of the wave
  // freq:     horizontal frequency
  // phase:    time-based phase offset
  // hue:      color of this ribbon
  // strength: how "sharp" the ribbon edge is (0=thin, 1=thick/soft)
  vec4 wave(vec2 xy, float amp, float freq, float phase, vec3 hue, float strength) {
    strength = clamp(strength, 0.0, 1.0);

    // Wave centre position
    float wave1a = _sin(phase + 0.40 * freq * xy.x);
    float wave1b = _sin(phase + 0.20 * freq * xy.x);
    float y = clamp(xy.y + amp * (wave1a + wave1b) * 0.5, -1.0, 1.0);

    // Variable thickness along the ribbon
    float wave2a = _sin(phase + 0.20 * freq * xy.x);
    float wave2b = _sin(phase + 0.10 * freq * xy.x);
    float tb = 0.5 * (wave2a + wave2b) * 0.5;
    tb = 0.5 + _sin(0.25 * (u_time + xy.x)) * tb;

    float topT = clamp(0.50 * pow(1.0 - tb, 3.0), 0.01, 1.0);
    float botT = clamp(0.25 * pow(tb,        3.0), 0.01, 1.0);

    float brightness = y > 0.0
      ? 1.0 - y / topT
      : 1.0 + y / botT;
    brightness = clamp(brightness, 0.0, 1.0);
    brightness = pow(brightness, 5.0 - 4.0 * strength);

    return vec4(vec3(brightness) * hue, 1.0);
  }

  void main() {
    // Normalized coords: [-1..1] x [-1/aspect .. 1/aspect]
    // Divide by aspect so ribbons span the full width naturally
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;

    vec2 mouse = u_mouse_norm;

    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    // Cursor-driven amplitude boost
    float cursorEnergy = length(mouse) * 0.6;

    // WebGL 1.0: loop bounds must be compile-time constants
    #define LAYERS 7

    for (int i = 0; i < LAYERS; i++) {
      float layer   = float(i);
      float z       = 0.50 + layer * 0.08;
      float percent = layer / float(LAYERS);

      vec3 xyz = vec3(uv, z);

      // Mouse tilts the ribbon stack in 3D
      xyz = rotateX(xyz,  0.40 * mouse.y);
      xyz = rotateY(xyz, -0.40 * mouse.x);
      // Gentle auto-rotation
      xyz = rotateZ(xyz, 0.03 * _sin(0.08 * u_time + layer * 0.4));

      vec2 xy = project(xyz, z);

      // Per-layer parameters
      // amp must be large enough that the ribbon crosses y=0 (viewport centre)
      float amp      = 0.20 + 0.18 * percent + 0.15 * cursorEnergy;
      float freq     = 2.0  + 1.2  * percent;
      float phase    = u_time * (0.22 + 0.12 * percent)
                     + layer  * 1.05
                     + mouse.x * 2.0 + mouse.y * 1.4;
      float strength = 0.35 + 0.50 * percent + 0.20 * cursorEnergy;

      // Palette position: spread layers across mint→violet→teal arc
      float t   = percent + 0.12 * _sin(u_time * 0.18 + layer * 0.7);
      vec3  hue = palette(t);

      vec4 w = wave(xy, amp, freq, phase, hue, strength);

      // Additive blending — later (closer) layers are slightly brighter
      float layerBright = 0.80 + 0.60 * percent;
      color.rgb += w.rgb * w.a * layerBright;
    }

    // Tone-map: Reinhard, gentle — preserve vibrancy
    color.rgb = color.rgb / (color.rgb + 0.30);
    color.rgb = pow(color.rgb, vec3(0.80));

    // Vignette
    vec2 vig = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    float v  = 1.0 - dot(vig * 0.55, vig * 0.55);
    color.rgb *= clamp(v, 0.0, 1.0);

    // Subtle film grain
    float gr = (fract(sin(dot(gl_FragCoord.xy + fract(u_time * 0.001),
                              vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.018;
    color.rgb += gr;

    gl_FragColor = vec4(clamp(color.rgb, 0.0, 1.0), 1.0);
  }
`;

interface ShaderCanvasProps {
  className?: string;
}

export default function ShaderCanvas({ className = "" }: ShaderCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  // Smoothed mouse in -1..1 space
  const mouseRef   = useRef({ x: 0.0, y: 0.0 });
  const targetRef  = useRef({ x: 0.0, y: 0.0 });

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

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime       = gl.getUniformLocation(prog, "u_time");
    const uResolution = gl.getUniformLocation(prog, "u_resolution");
    const uMouseNorm  = gl.getUniformLocation(prog, "u_mouse_norm");

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

    // Track mouse over the whole page, convert to -1..1 relative to canvas
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Normalise to -1..1 relative to canvas centre
      targetRef.current = {
        x:  ((e.clientX - rect.left)  / rect.width  - 0.5) * 2.0,
        y: -((e.clientY - rect.top)   / rect.height - 0.5) * 2.0,
      };
    };
    window.addEventListener("mousemove", onMove);

    const t0 = performance.now();
    let last = t0;

    function render(now: number) {
      const dt      = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = (now - t0) / 1000;

      // Exponential smoothing — feels like the ribbons "follow" the cursor
      const smooth = 1.0 - Math.pow(0.012, dt);
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * smooth;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * smooth;

      gl!.uniform1f(uTime,       elapsed);
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform2f(uMouseNorm,  mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(render);
    }
    rafRef.current = requestAnimationFrame(render);

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
