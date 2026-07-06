const insights = [
  {
    label: "Resume quality",
    score: 84,
  },
  {
    label: "Technical alignment",
    score: 76,
  },
  {
    label: "Career readiness",
    score: 71,
  },
];

const priorities = [
  {
    title: "Strengthen SQL proficiency",
    description:
      "SQL appears across 78% of the Data Analyst roles aligned with your profile.",
  },
  {
    title: "Build a dashboard project",
    description:
      "A Power BI or Tableau project would strengthen your evidence of practical analytics experience.",
  },
  {
    title: "Improve resume impact",
    description:
      "Three project descriptions lack measurable outcomes and strong action-oriented language.",
  },
];

export default function CareerPreview() {
  return (
    <section
      id="career-intelligence"
      className="border-t border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-24">
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-medium text-neutral-500">
              Your career intelligence
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Know what is holding your profile back.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
              Career Intelligence turns your resume, skills, and target roles
              into focused professional priorities.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 p-8">
                <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm text-neutral-500">
                      Career intelligence score
                    </p>

                    <div className="mt-4 flex items-end gap-3">
                      <span className="text-6xl font-semibold tracking-tight text-neutral-950">
                        78
                      </span>

                      <span className="mb-2 text-lg text-neutral-400">
                        /100
                      </span>
                    </div>
                  </div>

                  <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
                    Strong potential
                  </div>
                </div>
              </div>

              <div className="grid border-b border-neutral-200 md:grid-cols-3">
                {insights.map((insight) => (
                  <div
                    key={insight.label}
                    className="border-b border-neutral-200 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                  >
                    <p className="text-sm text-neutral-500">{insight.label}</p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                      {insight.score}%
                    </p>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-neutral-950"
                        style={{ width: `${insight.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-950">
                    Your priority actions
                  </h3>

                  <span className="text-sm text-neutral-400">3 priorities</span>
                </div>

                <div className="mt-6">
                  {priorities.map((priority, index) => (
                    <article
                      key={priority.title}
                      className="grid gap-4 border-t border-neutral-200 py-6 sm:grid-cols-[40px_1fr]"
                    >
                      <span className="text-sm font-medium text-neutral-400">
                        0{index + 1}
                      </span>

                      <div>
                        <h4 className="font-medium text-neutral-950">
                          {priority.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                          {priority.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}