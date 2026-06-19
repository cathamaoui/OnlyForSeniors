"use client";

import {
  Newspaper,
  Package,
  Wrench,
  Theater,
  Heart,
  Brain,
  Briefcase,
  AlertTriangle,
  Dog,
  Church,
  HandHeart,
  Home,
  Hammer,
  Stethoscope,
  Bus,
  Scale,
  Users,
  Building2,
  ShoppingCart,
  HeartHandshake,
  ShieldCheck,
  Search,
  Laptop,
  Plane,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/businesses";

/**
 * Generic, monochrome Lucide icon for a category. Each category gets ONE
 * simple icon (we don't try to perfectly represent every category — the
 * principle is consistency over cleverness). The icon renders inside a
 * black rounded square so it always looks the same regardless of the
 * background, the way the Taste Skill "skill" cards do.
 */

const SLUG_TO_ICON: Record<string, LucideIcon> = {
  // News / meta
  news: Newspaper,

  // The 5 main age-banded categories (homepage sidebar)
  "transition-downsizing": Package,
  "home-adaptations": Wrench,
  "active-aging-recreation": Dumbbell,
  "training-careers": Briefcase,
  "senior-travel": Plane,
  "active-aging": Theater, // legacy
  "wellness-comfort": Brain,
  "tech-help-for-seniors": Laptop,
  "senior-concierge-errands": Briefcase,
  "concierge-tech": Briefcase, // legacy

  // Equipment / safety
  "falls-wandering": AlertTriangle,

  // Companionship & support
  "pet-therapy": Dog,
  pastoral: Church,
  volunteer: HandHeart,

  // Service categories
  "home-care": Home,
  "home-maintenance": Hammer,
  "health-wellness": Stethoscope,
  transportation: Bus,
  "legal-financial": Scale,
  community: Users,
  housing: Building2,

  // Shopping / personal
  shopping: ShoppingCart,
  dating: Heart,
  "sexual-health": HeartHandshake,
  "intimate-wellness": HeartHandshake,

  // Trust / safety as a generic catch-all
  safety: ShieldCheck,
  // Browse-all fallback
  default: Search,
};

export function iconForSlug(slug: string): LucideIcon {
  return SLUG_TO_ICON[slug] ?? SLUG_TO_ICON.default;
}

type Props = {
  /** Either a Category object (uses its slug) or a raw slug string. */
  category?: Pick<Category, "slug">;
  slug?: string;
  /** Visual size. "sm" = 8x8 square, "md" = 10x10, "lg" = 12x12. */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: { box: "w-6 h-6", icon: "w-6 h-6" },
  md: { box: "w-10 h-10", icon: "w-10 h-10" },
  lg: { box: "w-14 h-14", icon: "w-14 h-14" },
} as const;

export function CategoryIcon({ category, slug, size = "md", className = "" }: Props) {
  const useSlug = slug ?? category?.slug ?? "default";
  const Icon = iconForSlug(useSlug);
  const s = SIZES[size];
  return (
    <Icon
      aria-hidden="true"
      className={`${s.box} text-stone-900 flex-shrink-0 ${className}`}
      strokeWidth={1.5}
    />
  );
}
