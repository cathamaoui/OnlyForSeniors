import type { ReactNode } from "react";

// Stub ScrollReveal — anims removed; renders a plain wrapper.
export function ScrollReveal({ children }: { children: ReactNode; delay?: number }) {
  return <>{children}</>;
}
