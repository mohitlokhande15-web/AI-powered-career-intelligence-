import Link from "next/link";

import BackendStatus from "@/components/dashboard/BackendStatus";

type DashboardHeaderProps = {
  name: string;
  completion?: number;
};

export default function DashboardHeader({
  name,
  completion = 0,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Career workspace
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          Welcome back, {name}.
        </h1>

        <p className="mt-3 text-base text-neutral-600">
          Here is what your career profile needs next.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <BackendStatus />

        <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
          Profile {completion}% complete
        </div>

        <Link
          href="/profile"
          className="rounded-full bg-neutral-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Edit Profile
        </Link>
      </div>
    </header>
  );
}