"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * GSAP-powered text reveal.
 * Words slide up with a stagger - bold, dramatic, easy to follow.
 */
export function RevealText({
  children,
  className = "",
  delay = 0,
  as: Tag = "h1",
}: {
  children: string;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const words = children.split(" ");
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="reveal-word" style="display:inline-block;overflow:hidden;"><span style="display:inline-block;transform:translateY(110%);">${w}&nbsp;</span></span>`
      )
      .join("");

    const inner = el.querySelectorAll(".reveal-word > span");
    gsap.to(inner, {
      y: 0,
      duration: 0.8,
      ease: "power4.out",
      stagger: 0.06,
      delay,
    });
  }, [children, delay]);

  const TagAny = Tag as unknown as React.ElementType;
  return (
    <TagAny ref={ref} className={className}>
      {children}
    </TagAny>
  );
}
