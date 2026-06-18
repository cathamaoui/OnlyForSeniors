"use client";
import { Heart } from "lucide-react";
import { useState } from "react";

export function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      type="button"
      aria-label="Save"
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved((s) => !s);
      }}
      className="absolute top-2 right-2 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-yp transition-colors"
    >
      <Heart className={`w-4 h-4 ${saved ? "fill-rose-600 stroke-rose-600" : ""}`} />
    </button>
  );
}
