import { SignupProgress } from "@/components/layout/SignupProgress";
import { SignupForm } from "./SignupForm";

export const metadata = {
  title: "Create your account — Only For Seniors",
  description:
    "Set up your Only For Seniors business account. $10/month subscription plus applicable provincial taxes. Cancel anytime.",
};

export default function ListBusinessPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignupProgress current={1} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-base font-semibold text-stone-800 mb-2">
            Step 1 of 4
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            Create your business account
          </h1>
          <p className="mt-3 text-lg text-stone-700">
            This takes about 60 seconds. You can save and come back any time.
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-base text-stone-700">
          Already have an account?{" "}
          <a
            href="mailto:hello@onlyforseniors.ca"
            className="font-semibold text-blue-700 underline hover:text-blue-800"
          >
            Contact us
          </a>{" "}
          to sign in.
        </p>
      </div>
    </div>
  );
}
