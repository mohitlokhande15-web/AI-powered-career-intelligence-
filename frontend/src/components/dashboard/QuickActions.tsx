import Link from "next/link";

const actions = [
  {
    number: "01",
    title: "Upload your resume",
    description:
      "Add or update your resume to improve the accuracy of your career analysis.",
    href: "/resume",
  },
  {
    number: "02",
    title: "Analyse a job description",
    description:
      "Compare your profile with a specific opportunity and understand your gaps.",
    href: "/job-analysis",
  },
  {
    number: "03",
    title: "View career intelligence",
    description:
      "Explore your readiness score, skill gaps, and professional guidance.",
    href: "/career-intelligence",
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            Quick actions
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            Continue building your profile.
          </h2>
        </div>
      </div>

      <div className="mt-7 grid gap-4 xl:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.number}
            href={action.href}
            className="group flex min-h-64 flex-col rounded-3xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
          >
            <span className="text-sm font-medium text-neutral-400">
              {action.number}
            </span>

            <h3 className="mt-10 text-xl font-semibold tracking-tight text-neutral-950">
              {action.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {action.description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-5">
              <span className="text-sm text-neutral-500">
                Open
              </span>

              <span className="transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}