"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Animates a single element with a soft, attention-getting float.
 * Used for the hero mascot and featured callouts.
 */
export function FloatingElement({
  children,
  className = "",
  duration = 4,
  y = 14,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const tween = gsap.to(el, {
      y: -y,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [duration, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
