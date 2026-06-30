"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scoped animated WebGL grid. Unlike the original 21st.dev component (a fixed,
 * fullscreen, bright cyan/magenta background), this version fills its parent
 * container and is retuned to the site's accent so it reads as an ambient hero
 * layer. The base is transparent — only the glowing grid lines blend over
 * whatever sits behind it, so it works on both dark and light themes.
 */
export default function CyberneticGridShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const startTime = performance.now();

    const vertexShader = /* glsl */ `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Retuned: single accent hue, gentler line falloff, transparent base.
    const fragmentShader = /* glsl */ `
      precision highp float;
      uniform vec2  iResolution;
      uniform float iTime;
      uniform vec2  iMouse;
      uniform vec3  uAccent;

      void main() {
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;

        float t         = iTime * 0.16;
        float mouseDist = length(uv - mouse);

        // subtle warp around the cursor
        float warp = sin(mouseDist * 16.0 - t * 4.0) * 0.06;
        warp *= smoothstep(0.5, 0.0, mouseDist);
        uv += warp;

        // grid lines
        vec2 gridUv = abs(fract(uv * 9.0) - 0.5);
        float line  = pow(1.0 - min(gridUv.x, gridUv.y), 60.0);

        // gentle pulse along the grid
        vec3 color = uAccent * line * (0.42 + sin(t * 2.0) * 0.14);

        // faint energy crawl, kept in-hue (no magenta)
        float energy = sin(uv.x * 18.0 + t * 5.0) * sin(uv.y * 18.0 + t * 3.0);
        energy = smoothstep(0.85, 1.0, energy);
        color += (uAccent + vec3(0.18)) * energy * line * 0.6;

        // soft glow around the cursor
        float glow = smoothstep(0.14, 0.0, mouseDist);
        color += uAccent * glow * 0.35;

        // only the lit lines are visible; the field stays transparent
        float alpha = clamp(max(max(color.r, color.g), color.b), 0.0, 1.0);
        gl_FragColor = vec4(color, alpha * 0.85);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2(0, 0) },
      // site accent (#22D3EE) in linear-ish 0..1
      uAccent: { value: new THREE.Vector3(0.13, 0.83, 0.93) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const setSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(width, height);
      if (uniforms.iMouse.value.x === 0 && uniforms.iMouse.value.y === 0) {
        uniforms.iMouse.value.set(width * 0.5, height * 0.55);
      }
    };
    setSize();

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    // Listen on the window (not the container) so the warp tracks the cursor
    // even though the canvas sits behind the hero content with pointer-events
    // disabled — it never intercepts clicks on the hero CTAs.
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.iMouse.value.set(
        e.clientX - rect.left,
        rect.height - (e.clientY - rect.top),
      );
    };
    window.addEventListener("mousemove", onMouseMove);

    const renderFrame = () => {
      uniforms.iTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };

    if (reduceMotion) {
      renderFrame();
    } else {
      renderer.setAnimationLoop(renderFrame);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      canvas.parentNode?.removeChild(canvas);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
