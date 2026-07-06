import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-sm font-semibold text-white">
                CI
              </div>

              <span className="font-semibold tracking-tight text-neutral-950">
                Career Intelligence
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-500">
              AI-powered career intelligence for clearer professional decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-neutral-950">Product</p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="#features"
                  className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                  Features
                </Link>

                <Link
                  href="#how-it-works"
                  className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                  How it works
                </Link>

                <Link
                  href="#career-intelligence"
                  className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                  Career intelligence
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-950">Account</p>

              <div className="mt-4 flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="text-sm text-neutral-500 hover:text-neutral-950"
                >
                  Get started
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-950">Platform</p>

              <div className="mt-4 flex flex-col gap-3">
                <span className="text-sm text-neutral-500">
                  Resume analysis
                </span>

                <span className="text-sm text-neutral-500">
                  Skill intelligence
                </span>

                <span className="text-sm text-neutral-500">
                  Job matching
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-sm text-neutral-400">
            © 2026 Career Intelligence. Built for smarter career decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}