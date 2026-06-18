import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Post a Listing — Only For Seniors",
  description: "Post your business on Only For Seniors.",
};

export default function ListBusinessPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-black border-2 border-black font-display   text-base shadow-sm hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl font-display font-bold">Post a Listing</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border-2 border-black rounded-lg p-8">
          <h2 className="text-2xl font-display font-black mb-3">Coming soon</h2>
          <p className="text-stone-700 mb-4">
            Self-serve posting is launching shortly. In the meantime, send us an email with your
            business details and we'll add you to the directory for free during our launch period.
          </p>
          <a
            href="mailto:hello@onlyforseniors.ca"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-black border-2 border-black font-display font-bold hover:bg-stone-900"
          >
            <Mail className="w-5 h-5" /> hello@onlyforseniors.ca
          </a>
        </div>
      </div>
    </div>
  );
}
