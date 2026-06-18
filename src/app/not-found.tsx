import Link from "next/link";

export default function NotFound() {
  return (
    <div className="yp-paper min-h-[60vh] flex items-center">
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-7xl mb-3" aria-hidden="true">📖</p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-emerald-900 mb-3">
          Page not found
        </h1>
        <p className="text-xl text-emerald-800 mb-6">
          That page isn&apos;t in our book. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/categories" className="btn-ember">Browse Categories</Link>
        </div>
      </div>
    </div>
  );
}
