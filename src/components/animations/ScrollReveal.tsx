// Simple replacement for the old GSAP-based ScrollReveal.
// Just renders children directly (kept for API compatibility).
import { ReactNode } from "react";

export function ScrollReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return <div className={className}>{children}</div>;
}
