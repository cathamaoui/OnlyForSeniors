import { SignupProgress } from "@/components/layout/SignupProgress";
import { Dashboard } from "./Dashboard";

export const metadata = {
  title: "Dashboard — Only For Seniors",
  description: "Manage your business subscription, profile, and listings.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SignupProgress current={4} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Dashboard />
      </div>
    </div>
  );
}
