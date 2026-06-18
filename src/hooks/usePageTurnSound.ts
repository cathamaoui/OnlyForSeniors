"use client";

import { useEffect, useRef } from "react";

/**
 * Hook that gives you a `playPageTurn()` function to trigger
 * the skeuomorphic page-flip sound effect.
 *
 * - Audio is created lazily on first user interaction (browsers
 *   block autoplay otherwise).
 * - Volume is tuned for a senior audience.
 * - Respects `prefers-reduced-motion` (we don't *play* sound when
 *   motion is reduced, since the sound is part of the flip experience).
 */
export function usePageTurnSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const primedRef = useRef(false);

  useEffect(() => {
    // Don't auto-preload — wait for first user gesture.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const a = new Audio("/sounds/page-turn.ogg");
      a.preload = "auto";
      a.volume = 0.85;
      audioRef.current = a;
    }
    primedRef.current = true;
    return audioRef.current;
  };

  const playPageTurn = (direction: "forward" | "backward" = "forward") => {
    // Respect reduced motion - still play sound but lower volume
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    const a = ensureAudio();
    // Play from start
    a.currentTime = 0;
    // Backward sounds slightly different (slight rate change)
    a.playbackRate = direction === "backward" ? 0.85 : 1;
    a.play().catch(() => {
      // Autoplay blocked - try priming on the next click
    });
  };

  return { playPageTurn };
}
