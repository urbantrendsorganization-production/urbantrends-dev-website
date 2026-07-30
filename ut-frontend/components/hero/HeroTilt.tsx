"use client";

import { useEffect, useRef } from "react";

/**
 * Mouse-tracked 3D tilt for the hero panel.
 *
 * Wraps the panel in a perspective root and drives any descendant marked
 * `data-tilt="media"` or `data-tilt="board"`. The two move at different rates
 * so the stack reads as layered rather than as one rotating slab.
 *
 * Deliberately inert for anyone who wouldn't benefit or wouldn't want it:
 * coarse pointers (there is no cursor to track), and
 * `prefers-reduced-motion`.
 */

type Props = {
  /** Max rotation in degrees at the far edge. */
  strength?: number;
  className?: string;
  children: React.ReactNode;
};

export default function HeroTilt({ strength = 9, className, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const media = root.querySelector<HTMLElement>('[data-tilt="media"]');
    const board = root.querySelector<HTMLElement>('[data-tilt="board"]');
    if (!media && !board) return;

    // The rect is cached rather than measured per event. Reading
    // getBoundingClientRect() inside a mousemove handler forces a layout on
    // every pointer sample, which is a lot of thrash for an effect this
    // decorative — especially with the hero shader compositing behind it.
    let rect = root.getBoundingClientRect();
    const remeasure = () => { rect = root.getBoundingClientRect(); };

    let frame: number | null = null;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      frame = null;
      if (media) {
        media.style.transform =
          `rotateX(${-ty * strength}deg) rotateY(${tx * strength}deg) translateZ(28px)`;
      }
      if (board) {
        const s = strength * 0.6;
        board.style.transform = `rotateX(${-ty * s}deg) rotateY(${tx * s}deg)`;
      }
    };

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(apply);
    };

    const onMove = (e: MouseEvent) => {
      const clamp = (n: number) => Math.max(-1, Math.min(1, n));
      tx = clamp((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
      ty = clamp((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
      schedule();
    };

    const reset = () => { tx = 0; ty = 0; schedule(); };

    // Track only while the hero is actually on screen — no reason to handle
    // mouse events for an element the visitor scrolled past ten sections ago.
    let listening = false;
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        remeasure();
        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseout", reset, { passive: true });
      } else {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseout", reset);
        reset();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => listen(entry.isIntersecting),
      { rootMargin: "64px" },
    );
    io.observe(root);

    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, { passive: true });

    return () => {
      io.disconnect();
      listen(false);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
