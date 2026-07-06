import ResumeUploader from "@/components/resume/ResumeUploader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
          <header className="border-b border-neutral-200 pb-8">
            <p className="text-sm font-medium text-neutral-500">
              Resume intelligence
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
              Understand your resume.
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
              Analyse the professional signals inside your resume and identify
              the changes that can strengthen your career profile.
            </p>
          </header>

          <div className="mt-10">
            <ResumeUploader />
          </div>
        </div>
      </div>
    </main>
  );
}