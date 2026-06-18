import { LoginForm } from "@/components/business/LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Business Login",
};

export default function BusinessLoginPage() {
  return (
    <div className="yp-paper min-h-[70vh]">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card-retro">
          <h1 className="font-display font-black text-3xl text-emerald-900 mb-2 text-center">
            Business Login
          </h1>
          <p className="text-center text-emerald-800 mb-6">
            Sign in to manage your listing.
          </p>
          <LoginForm />
          <p className="mt-6 text-center text-emerald-800">
            New here?{" "}
            <Link href="/list-business" className="text-ember-600 font-bold underline">
              List your business
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
