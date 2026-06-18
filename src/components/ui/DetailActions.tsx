"use client";
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

export function DetailActions() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Save"
        aria-pressed={saved}
        onClick={() => setSaved((s) => !s)}
        className="w-10 h-10 border-2 border-black rounded flex items-center justify-center hover:bg-stone-100"
      >
        <Heart className={`w-5 h-5 ${saved ? "fill-rose-600 stroke-rose-600" : ""}`} />
      </button>
      <button
        type="button"
        aria-label="Share"
        onClick={() => {
          const nav = navigator as Navigator | undefined;
          if (nav && typeof nav.share === "function") {
            nav.share({ url: window.location.href }).catch(() => {});
          } else if (nav && nav.clipboard && typeof nav.clipboard.writeText === "function") {
            nav.clipboard.writeText(window.location.href).catch(() => {});
          }
        }}
        className="w-10 h-10 border-2 border-black rounded flex items-center justify-center hover:bg-stone-100"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}
