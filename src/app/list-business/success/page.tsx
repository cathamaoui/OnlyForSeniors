import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="yp-paper min-h-[60vh]">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card-retro">
          <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-emerald-900 mb-3">
            Welcome to Only For Seniors!
          </h1>
          <p className="text-lg text-emerald-800 leading-relaxed mb-6">
            Your business has been created. To make it live in the directory,
            please complete your $10/month subscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/list-business/billing" className="btn-ember">
              Activate Subscription ($10/mo)
            </Link>
          </div>
          <p className="mt-6 text-sm text-emerald-800">
            Need to update your business details? You can edit everything from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
