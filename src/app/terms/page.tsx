export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="yp-paper">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-black text-4xl text-emerald-900 mb-6">Terms of Service</h1>
        <div className="card-retro text-emerald-900 space-y-4 leading-relaxed">
          <p>
            By using OnlyForSeniors.ca you agree to these terms. Please read them carefully.
          </p>
          <h2 className="font-display text-2xl">For users (seniors)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>The directory is provided free of charge</li>
            <li>You are responsible for any agreement you make with a listed business</li>
            <li>Be respectful when leaving reviews</li>
          </ul>
          <h2 className="font-display text-2xl">For business owners</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Subscriptions are $10 CAD per month, billed via Stripe</li>
            <li>You may cancel at any time; service continues until period end</li>
            <li>Listings must be accurate and not misleading</li>
            <li>You must comply with all applicable Canadian laws</li>
          </ul>
          <p className="text-sm text-emerald-700">
            This is a sample terms of service. Have it reviewed by a legal professional
            before going into production.
          </p>
        </div>
      </div>
    </div>
  );
}
