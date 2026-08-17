import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="rounded-[2rem] bg-neutral-950 px-8 py-20 text-center text-white sm:px-12 lg:py-28">
          <p className="text-sm font-medium text-neutral-400">
            Your career deserves clarity
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Stop guessing what to improve next.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            Understand your profile, discover your priorities, and make career
            decisions with professional intelligence.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200"
            >
              Analyse your career
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}