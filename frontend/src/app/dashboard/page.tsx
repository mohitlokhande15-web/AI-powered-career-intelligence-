import CareerScoreCard from "@/components/dashboard/CareerScoreCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PriorityActions from "@/components/dashboard/PriorityActions";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
          <DashboardHeader />

          <div className="mt-10 space-y-10">
            <CareerScoreCard />

            <QuickActions />

            <PriorityActions />
          </div>
        </div>
      </div>
    </main>
  );
}