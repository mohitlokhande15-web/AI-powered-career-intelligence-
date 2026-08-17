const steps = [
  {
    step: "01",
    title: "Build your career profile",
    description:
      "Upload your resume and tell us which roles, industries, or career paths you are targeting.",
  },
  {
    step: "02",
    title: "Add a job description",
    description:
      "Paste a job description to understand how your experience and skills align with a real opportunity.",
  },
  {
    step: "03",
    title: "Analyse your career intelligence",
    description:
      "Your profile is evaluated across resume quality, skill alignment, career readiness, and professional gaps.",
  },
  {
    step: "04",
    title: "Know exactly what to improve",
    description:
      "Receive clear priorities, professional guidance, and relevant job recommendations based on your profile.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-neutral-200 bg-neutral-950 text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-sm font-medium text-neutral-400">
              How it works
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              From career uncertainty to clear priorities.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-400">
              Career Intelligence connects your resume, skills, goals, and job
              opportunities into one professional analysis.
            </p>
          </div>

          <div>
            {steps.map((item) => (
              <article
                key={item.step}
                className="grid gap-5 border-t border-white/15 py-8 sm:grid-cols-[64px_1fr]"
              >
                <span className="text-sm font-medium text-neutral-500">
                  {item.step}
                </span>

                <div>
                  <h3 className="text-xl font-medium tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}