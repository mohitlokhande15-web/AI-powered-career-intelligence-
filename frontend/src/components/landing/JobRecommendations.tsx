const jobs = [
  {
    company: "Nova Analytics",
    role: "Junior Data Analyst",
    location: "Bengaluru · Hybrid",
    match: 92,
    skills: ["Python", "Excel", "SQL"],
  },
  {
    company: "Vertex Systems",
    role: "Business Intelligence Analyst",
    location: "Pune · On-site",
    match: 86,
    skills: ["Power BI", "SQL", "Data Analysis"],
  },
  {
    company: "Orbit Technologies",
    role: "Graduate Data Analyst",
    location: "Hyderabad · Hybrid",
    match: 82,
    skills: ["Python", "Statistics", "Excel"],
  },
  {
    company: "Northstar Digital",
    role: "Associate Analytics Consultant",
    location: "Mumbai · Hybrid",
    match: 79,
    skills: ["Analytics", "SQL", "Communication"],
  },
];

export default function JobRecommendations() {
  return (
    <section className="overflow-hidden border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-neutral-500">
              Job recommendations
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Opportunities aligned with your potential.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Discover roles based on your skills, career readiness, and
              professional profile—not only job titles.
            </p>
          </div>

          <p className="text-sm text-neutral-500">
            Based on your career intelligence
          </p>
        </div>

        <div className="hide-scrollbar mt-16 overflow-x-auto pb-6">
          <div className="flex min-w-max gap-5">
            {jobs.map((job) => (
              <article
                key={`${job.company}-${job.role}`}
                className="flex min-h-[390px] w-[340px] flex-col rounded-3xl border border-neutral-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 sm:w-[390px]"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white">
                    {job.company
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
                    {job.match}% match
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-sm text-neutral-500">{job.company}</p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                    {job.role}
                  </h3>

                  <p className="mt-3 text-sm text-neutral-500">
                    {job.location}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto border-t border-neutral-200 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">
                      View match analysis
                    </span>

                    <span className="text-lg text-neutral-950">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}