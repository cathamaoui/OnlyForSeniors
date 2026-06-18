export const metadata = {
  title: "Accessibility",
};

export default function AccessibilityPage() {
  return (
    <div className="yp-paper">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-black text-4xl text-emerald-900 mb-6">
          Accessibility Statement
        </h1>
        <div className="card-retro prose prose-lg max-w-none text-emerald-900">
          <p>
            OnlyForSeniors.ca is built from the ground up for accessibility —
            especially for users 65 and older.
          </p>
          <h2 className="font-display text-2xl text-emerald-900 mt-4">What we do</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Base font size of 18px (larger than most sites)</li>
            <li>High-contrast colours and visible 4px focus outlines</li>
            <li>All buttons and tap targets at least 48px tall (Apple/Google guidelines)</li>
            <li>Visible text instructions under every interactive control</li>
            <li>Mobile-first responsive design that works on phones, tablets, and computers</li>
            <li>Skip-to-content link for keyboard and screen-reader users</li>
            <li>Semantic HTML, ARIA labels, and screen-reader friendly</li>
            <li>Respects <code>prefers-reduced-motion</code> — animations pause for sensitive users</li>
            <li>Big tap-to-call phone numbers — no tiny links</li>
          </ul>
          <h2 className="font-display text-2xl text-emerald-900 mt-6">If something is hard to use</h2>
          <p>
            Call us at <strong>1-800-555-0199</strong> and we&apos;ll help you find what you need
            or improve the site for you. We&apos;re always listening.
          </p>
        </div>
      </div>
    </div>
  );
}
