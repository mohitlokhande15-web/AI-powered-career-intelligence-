import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600">
            AI-powered career intelligence
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Understand your career.
            <span className="block text-neutral-400">
              Build what comes next.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">
            Analyse your resume, discover skill gaps, understand your career
            readiness, and find opportunities aligned with your professional
            potential.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-full bg-neutral-950 px-7 py-3.5 text-center text-sm font-medium text-white transition hover:bg-neutral-800 sm:w-auto"
            >
              Analyse your career
            </Link>

            <Link
              href="#how-it-works"
              className="w-full rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-center text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:w-auto"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3 shadow-2xl shadow-black/5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-500">
                    Career intelligence score
                  </p>

                  <div className="mt-5 flex items-end gap-3">
                    <span className="text-6xl font-semibold tracking-tight text-neutral-950">
                      78
                    </span>

                    <span className="mb-2 text-lg text-neutral-400">/100</span>
                  </div>

                  <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-600">
                    Your profile shows strong technical potential. Improving
                    three priority skills could significantly increase your job
                    readiness.
                  </p>
                </div>

                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <p className="text-sm text-neutral-500">Resume score</p>
                    <p className="mt-3 text-3xl font-semibold text-neutral-950">
                      84%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-5">
                    <p className="text-sm text-neutral-500">Skill match</p>
                    <p className="mt-3 text-3xl font-semibold text-neutral-950">
                      72%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 p-5 sm:col-span-2">
                    <p className="text-sm text-neutral-500">
                      Priority skill gaps
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["SQL", "Power BI", "Advanced Python"].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}