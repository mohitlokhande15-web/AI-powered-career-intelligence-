import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-sm font-semibold text-white">
                CI
              </div>

              <span className="text-lg font-semibold tracking-tight text-neutral-950">
                Career Intelligence
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-16">
            <div className="w-full max-w-md">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950">
                {title}
              </h1>

              <p className="mt-4 text-base leading-7 text-neutral-600">
                {description}
              </p>

              <div className="mt-10">{children}</div>
            </div>
          </div>
        </section>

        <section className="hidden bg-neutral-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-400">
              Career Intelligence
            </p>

            <h2 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight">
              Build your career with clearer professional priorities.
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm text-neutral-400">
              Career intelligence score
            </p>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-6xl font-semibold">78</span>
              <span className="mb-2 text-lg text-neutral-500">/100</span>
            </div>

            <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-400">
              Understand your resume quality, skill alignment, career readiness,
              and the actions that can improve your professional profile.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs text-neutral-500">Resume</p>
                <p className="mt-2 text-xl font-medium">84%</p>
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs text-neutral-500">Skills</p>
                <p className="mt-2 text-xl font-medium">76%</p>
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs text-neutral-500">Readiness</p>
                <p className="mt-2 text-xl font-medium">71%</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}