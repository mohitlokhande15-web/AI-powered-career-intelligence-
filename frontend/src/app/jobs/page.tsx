import JobRecommendations from "@/components/jobs/JobRecommendations";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
          <header className="border-b border-neutral-200 pb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Job recommendations
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
                  Opportunities aligned with your profile.
                </h1>

                <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600">
                  Explore roles ranked using your skills, career readiness,
                  professional evidence, and target career direction.
                </p>
              </div>

              <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
                4 recommended roles
              </div>
            </div>
          </header>

          <div className="mt-10">
            <JobRecommendations />
          </div>
        </div>
      </div>
    </main>
  );
}