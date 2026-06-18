import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white">
      <div className="max-w-xl mx-auto px-4 py-20 sm:py-28 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700 mb-3">
          404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
          Page not found
        </h1>
        <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-md mx-auto">
          That page isn&apos;t in our directory. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-touch px-6 py-3 bg-black text-white text-lg font-semibold rounded-lg border-2 border-black hover:bg-stone-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/categories/"
            className="inline-flex items-center justify-center min-h-touch px-6 py-3 bg-white text-black text-lg font-semibold rounded-lg border-2 border-black hover:bg-stone-50 transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
