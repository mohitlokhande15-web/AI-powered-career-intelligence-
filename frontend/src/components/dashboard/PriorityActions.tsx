const priorities = [
  {
    number: "01",
    title: "Strengthen SQL proficiency",
    description:
      "SQL is required across most Data Analyst opportunities aligned with your target role.",
    impact: "High impact",
  },
  {
    number: "02",
    title: "Build an analytics dashboard project",
    description:
      "Add one practical Power BI or Tableau project to demonstrate applied analytics skills.",
    impact: "High impact",
  },
  {
    number: "03",
    title: "Improve project descriptions",
    description:
      "Use measurable outcomes and stronger action-oriented language in your resume projects.",
    impact: "Medium impact",
  },
];

export default function PriorityActions() {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Career guidance
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
          Your priority actions.
        </h2>
      </div>

      <div className="mt-8">
        {priorities.map((priority) => (
          <article
            key={priority.number}
            className="grid gap-5 border-t border-neutral-200 py-7 sm:grid-cols-[48px_1fr_auto]"
          >
            <span className="text-sm font-medium text-neutral-400">
              {priority.number}
            </span>

            <div>
              <h3 className="font-medium text-neutral-950">
                {priority.title}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                {priority.description}
              </p>
            </div>

            <span className="h-fit rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
              {priority.impact}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}