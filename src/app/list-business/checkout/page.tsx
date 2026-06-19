import { SignupProgress } from "@/components/layout/SignupProgress";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = {
  title: "Checkout — Only For Seniors",
  description: "Review and confirm your subscription.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignupProgress current={3} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-base font-semibold text-stone-800 mb-2">
            Step 3 of 4
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-stone-900">
            Review and pay
          </h1>
          <p className="mt-3 text-lg text-stone-700">
            $10/month subscription. We&apos;ll email you an invoice and your login details.
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  );
}
