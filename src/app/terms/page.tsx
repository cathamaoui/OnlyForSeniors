export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-stone-900 mb-6">Terms of Service</h1>
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-stone-900 space-y-4 leading-relaxed">
          <p>
            By using OnlyForSeniors.ca you agree to these terms. Please read them carefully.
          </p>
          <h2 className="font-display font-black text-2xl text-stone-900">For users (seniors)</h2>
          <ul className="list-disc pl-6 space-y-1 text-stone-700">
            <li>The directory is provided free of charge</li>
            <li>You are responsible for any agreement you make with a listed business</li>
            <li>Be respectful when leaving reviews</li>
          </ul>
          <h2 className="font-display font-black text-2xl text-stone-900">For business owners</h2>
          <ul className="list-disc pl-6 space-y-1 text-stone-700">
            <li>Subscriptions are $10 CAD per month, billed via Stripe</li>
            <li>You may cancel at any time; service continues until period end</li>
            <li>Listings must be accurate and not misleading</li>
            <li>You must comply with all applicable Canadian laws</li>
          </ul>
          <p className="text-base text-stone-700">
            This is a sample terms of service. Have it reviewed by a legal professional
            before going into production.
          </p>
        </div>
      </div>
    </div>
  );
}
