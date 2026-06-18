import { SignupProgress } from "@/components/layout/SignupProgress";
import { Confirmation } from "./Confirmation";

export const metadata = {
  title: "You’re in — Only For Seniors",
  description: "Your Only For Seniors subscription is active. Here's your invoice.",
};

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignupProgress current={4} />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Confirmation />
      </div>
    </div>
  );
}
