const metrics = [
  {
    label: "Resume quality",
    score: 84,
  },
  {
    label: "Skill alignment",
    score: 76,
  },
  {
    label: "Career readiness",
    score: 71,
  },
];

export default function CareerScoreCard() {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white">
      <div className="flex flex-col justify-between gap-8 border-b border-neutral-200 p-8 sm:flex-row sm:items-end">
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

      <div className="grid md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="border-b border-neutral-200 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <p className="text-sm text-neutral-500">
              {metric.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              {metric.score}%
            </p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-950"
                style={{
                  width: `${metric.score}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}