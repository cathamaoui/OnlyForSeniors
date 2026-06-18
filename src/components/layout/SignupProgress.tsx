import Link from "next/link";
import { Check } from "lucide-react";

export type Step = {
  n: 1 | 2 | 3 | 4;
  label: string;
  href: string;
};

export const STEPS: Step[] = [
  { n: 1, label: "Account",   href: "/list-business/" },
  { n: 2, label: "Profile",   href: "/list-business/profile/" },
  { n: 3, label: "Checkout",  href: "/list-business/checkout/" },
  { n: 4, label: "Done",      href: "/list-business/confirmation/" },
];

export function SignupProgress({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <nav aria-label="Signup progress" className="bg-white border-b-2 border-stone-200">
      <ol className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2 sm:gap-4 overflow-x-auto">
        {STEPS.map((s, i) => {
          const isCurrent = s.n === current;
          const isDone = s.n < current;
          return (
            <li key={s.n} className="flex items-center gap-2 sm:gap-3 shrink-0">
              {i > 0 && (
                <span
                  className={`block h-[2px] w-6 sm:w-10 ${
                    isDone || isCurrent ? "bg-blue-700" : "bg-stone-300"
                  }`}
                  aria-hidden="true"
                />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-base font-bold",
                    isCurrent
                      ? "bg-blue-700 text-white"
                      : isDone
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-700"
                      : "bg-stone-200 text-stone-700",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.n}
                </span>
                <Link
                  href={s.href}
                  className={[
                    "text-base font-semibold",
                    isCurrent
                      ? "text-stone-900"
                      : isDone
                      ? "text-stone-800 hover:text-black"
                      : "text-stone-500",
                  ].join(" ")}
                >
                  {s.label}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
