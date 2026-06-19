export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-stone-900 mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-stone-900 space-y-4 leading-relaxed">
          <p>
            <strong>Your privacy matters.</strong> OnlyForSeniors.ca is committed to
            protecting the personal information of Canadian seniors.
          </p>
          <h2 className="font-display font-black text-2xl text-stone-900">What we collect</h2>
          <ul className="list-disc pl-6 space-y-1 text-stone-700">
            <li>Account info (name, email, phone) when you create a listing</li>
            <li>Messages you send to businesses through the platform</li>
            <li>Basic usage data to improve the site</li>
          </ul>
          <h2 className="font-display font-black text-2xl text-stone-900">What we don&apos;t do</h2>
          <ul className="list-disc pl-6 space-y-1 text-stone-700">
            <li>We never sell your data</li>
            <li>We never share your information with third-party advertisers</li>
          </ul>
          <h2 className="font-display font-black text-2xl text-stone-900">Contact us</h2>
          <p>Email: privacy@onlyforseniors.ca · Phone: 1-800-555-0199</p>
          <p className="text-base text-stone-700">
            This is a sample privacy policy. Have it reviewed by a legal professional
            before going into production.
          </p>
        </div>
      </div>
    </div>
  );
}
