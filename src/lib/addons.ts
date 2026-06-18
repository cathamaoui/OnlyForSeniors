// À la carte add-on upgrades offered at checkout. Each one is opt-in and
// stacks on top of the $10/month base subscription. Prices are in CAD and
// are subject to the buyer's provincial sales tax.
//
// A static export can't enforce server-side billing for these, but the
// checkout form collects which ones the customer selected, the order summary
// recalculates with them, and the invoice confirms what was purchased.

export type AddonInterval = "monthly" | "weekly" | "per-event";

export type Addon = {
  id: string;
  title: string;
  blurb: string;
  price: number;       // CAD, before tax
  interval: AddonInterval;
  highlight?: boolean; // recommended badge
};

export const ADDONS: Addon[] = [
  {
    id: "top-bump",
    title: "Top of Category bump",
    blurb:
      "Push your listing to the very top of its category search page, Kijiji-style. Buy it any week you need a boost.",
    price: 7,
    interval: "weekly",
    highlight: true,
  },
  {
    id: "senior-discount-badge",
    title: "Senior Discount badge",
    blurb:
      "Show a bright visual badge on your card so seniors know you offer an exclusive promotion or discount.",
    price: 3,
    interval: "monthly",
  },
  {
    id: "media-pack",
    title: "Multi-Media Expansion Pack",
    blurb:
      "Upgrade from a single photo to up to 10 high-resolution photos plus an embedded YouTube or Vimeo intro video. Video builds massive trust for in-home services.",
    price: 5,
    interval: "monthly",
    highlight: true,
  },
  {
    id: "event-spotlight",
    title: "Event / Sale Spotlight",
    blurb:
      "Host a workshop, class, or sale? Pay a flat micro-fee to put it directly on the public Events Calendar.",
    price: 5,
    interval: "per-event",
  },
];

export function getAddon(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}

export function formatInterval(interval: AddonInterval): string {
  switch (interval) {
    case "monthly":
      return "/ month";
    case "weekly":
      return "/ week";
    case "per-event":
      return " / event";
  }
}
