const features = [
  {
    number: "01",
    title: "Resume intelligence",
    description:
      "Go beyond keyword scanning. Understand the strengths, weaknesses, and professional signals inside your resume.",
  },
  {
    number: "02",
    title: "Skill gap analysis",
    description:
      "Identify the skills separating your current profile from the roles and career paths you want to pursue.",
  },
  {
    number: "03",
    title: "Career readiness score",
    description:
      "Measure your career readiness through resume quality, skill alignment, and role-specific professional signals.",
  },
  {
    number: "04",
    title: "Professional guidance",
    description:
      "Receive focused recommendations on what to learn, improve, and build next instead of generic career advice.",
  },
  {
    number: "05",
    title: "Job match intelligence",
    description:
      "Understand why a job matches your profile, where you fall short, and which opportunities deserve your attention.",
  },
  {
    number: "06",
    title: "Career progress tracking",
    description:
      "Track how your professional profile improves as you strengthen skills, projects, and resume quality.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-neutral-500">
            Career intelligence
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
            More than a resume score.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Understand where you stand, what is limiting your profile, and
            which actions can move your career forward.
          </p>
        </div>

        <div className="mt-16 grid border-l border-t border-neutral-200 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="min-h-72 border-b border-r border-neutral-200 p-8 transition duration-300 hover:bg-neutral-50 lg:p-10"
            >
              <p className="text-sm font-medium text-neutral-400">
                {feature.number}
              </p>

              <h3 className="mt-12 text-xl font-semibold tracking-tight text-neutral-950">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}