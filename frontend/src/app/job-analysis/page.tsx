import JobDescriptionAnalyzer from "@/components/job-analysis/JobDescriptionAnalyzer";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function JobAnalysisPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
          <header className="border-b border-neutral-200 pb-8">
            <p className="text-sm font-medium text-neutral-500">
              Job intelligence
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
              Understand your job match.
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
              Compare your career profile with a real opportunity and identify
              the skills, experience, and professional signals affecting your
              match.
            </p>
          </header>

          <div className="mt-10">
            <JobDescriptionAnalyzer />
          </div>
        </div>
      </div>
    </main>
  );
}