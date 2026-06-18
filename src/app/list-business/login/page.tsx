import { SignupProgress } from "@/components/layout/SignupProgress";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Business login — Only For Seniors",
  description: "Sign in to your Only For Seniors business account.",
};

export default function BusinessLoginPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignupProgress current={4} />
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="mb-6 text-center">
          <p className="text-base font-semibold text-stone-700 mb-2">
            Business account
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-stone-900">
            Sign in
          </h1>
          <p className="mt-3 text-base text-stone-700">
            Welcome back. Sign in to manage your listing, billing, and profile.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
