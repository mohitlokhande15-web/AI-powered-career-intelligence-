import CareerIntelligenceOverview from "@/components/career/CareerIntelligenceOverview";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function CareerIntelligencePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
          <header className="border-b border-neutral-200 pb-8">
            <p className="text-sm font-medium text-neutral-500">
              Career intelligence
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
              Understand your professional position.
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
              See the strengths, limitations, and professional signals shaping
              your career readiness and understand which actions can create the
              strongest improvement.
            </p>
          </header>

          <div className="mt-10">
            <CareerIntelligenceOverview />
          </div>
        </div>
      </div>
    </main>
  );
}