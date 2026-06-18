"use client";

import { ReactNode, useEffect, useState } from "react";
import { clsx } from "clsx";

interface PageCurlProps {
  /** A unique key that changes when the content should animate. */
  flipKey: string | number;
  children: ReactNode;
  /** "forward" = new page comes from the right; "backward" = from the left. */
  direction?: "forward" | "backward";
  className?: string;
}

/**
 * PageCurl — wraps content in a 3D page-curl transition.
 * When `flipKey` changes, the old content peels away like a turning
 * page, and the new content slides into view underneath.
 *
 * The "back" of the page is a slightly darker version of the same
 * colour, simulating the shadowed reverse side of a paper page.
 */
export function PageCurl({ flipKey, children, direction = "forward", className }: PageCurlProps) {
  const [animating, setAnimating] = useState(false);
  const [pending, setPending] = useState<ReactNode | null>(null);
  const [current, setCurrent] = useState<ReactNode>(children);
  const [currentKey, setCurrentKey] = useState(flipKey);

  useEffect(() => {
    if (flipKey === currentKey) {
      // First mount or no change -> just update
      setCurrent(children);
      return;
    }
    // Change -> trigger flip
    setAnimating(true);
    setPending(children);
    setCurrentKey(flipKey);

    const t = setTimeout(() => {
      setCurrent(children);
      setPending(null);
      setAnimating(false);
    }, 700); // match CSS animation duration

    return () => clearTimeout(t);
  }, [flipKey, children, currentKey]);

  return (
    <div className={clsx("relative perspective-1000", className)}>
      {/* The "live" page — sits underneath */}
      <div
        className={clsx(
          "relative z-10 transition-opacity duration-200",
          animating ? "opacity-0" : "opacity-100"
        )}
      >
        {current}
      </div>

      {/* The flipping page — peels away */}
      {animating && (
        <div
          key={`flip-${currentKey}`}
          className="absolute inset-0 z-20 page-curl-anim origin-left"
          style={{
            transformOrigin: direction === "forward" ? "left center" : "right center",
            animationName: direction === "forward" ? "pageCurlForward" : "pageCurlBackward",
            animationDuration: "0.7s",
            animationTimingFunction: "cubic-bezier(0.45, 0.05, 0.25, 1)",
            animationFillMode: "forwards",
            background: "#fffdf2",
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.15), 4px 0 12px rgba(0,0,0,0.2)",
            backfaceVisibility: "hidden",
          }}
        >
          {current}
        </div>
      )}

      {/* The new page sliding in */}
      {animating && pending && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "#fffdf2",
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.10)",
          }}
        >
          {pending}
        </div>
      )}
    </div>
  );
}
