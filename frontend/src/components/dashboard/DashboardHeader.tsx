export default function DashboardHeader() {
  return (
    <header className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Career workspace
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          Welcome back, Mohit.
        </h1>

        <p className="mt-3 text-base text-neutral-600">
          Here is what your career profile needs next.
        </p>
      </div>

      <div className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600">
        Profile updated today
      </div>
    </header>
  );
}