import { SignupProgress } from "@/components/layout/SignupProgress";
import { ProfileForm } from "./ProfileForm";

export const metadata = {
  title: "Your business — Only For Seniors",
  description: "Tell us about your business so seniors can find you.",
};

export default function ListBusinessProfilePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignupProgress current={2} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-base font-semibold text-stone-800 mb-2">
            Step 2 of 4
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            Tell us about your business
          </h1>
          <p className="mt-3 text-lg text-stone-700">
            This is what seniors will see in the directory. You can edit any of it later.
          </p>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
