/**
 * Server-safe icon map for categories. Lives in a non-"use client"
 * module so server components (like the homepage tile grid) can render
 * category icons without violating the client/server boundary.
 */
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
  Laptop,
  HeartHandshake,
  ShieldCheck,
  Search,
  type LucideIcon,
} from "lucide-react";

const SLUG_TO_ICON: Record<string, LucideIcon> = {
  news: Newspaper,
  "transition-downsizing": Package,
  "home-adaptations": Wrench,
  "active-aging": Theater,
  "wellness-comfort": Brain,
  "tech-help-for-seniors": Laptop,
  "senior-concierge-errands": Briefcase,
  "concierge-tech": Briefcase, // legacy slug — kept for any old references
  "falls-wandering": AlertTriangle,
  "pet-therapy": Dog,
  pastoral: Church,
  volunteer: HandHeart,
  "home-care": Home,
  "home-maintenance": Hammer,
  "health-wellness": Stethoscope,
  transportation: Bus,
  "legal-financial": Scale,
  community: Users,
  housing: Building2,
  shopping: ShoppingCart,
  dating: Heart,
  "sexual-health": HeartHandshake,
  "intimate-wellness": HeartHandshake,
  safety: ShieldCheck,
  default: Search,
};

export function iconForSlugServer(slug: string): LucideIcon {
  return SLUG_TO_ICON[slug] ?? SLUG_TO_ICON.default;
}