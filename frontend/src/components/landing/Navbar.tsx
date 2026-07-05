import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white">
            CI
          </div>

          <span className="text-lg font-semibold tracking-tight text-neutral-950">
            Career Intelligence
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm text-neutral-600 transition hover:text-neutral-950"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="text-sm text-neutral-600 transition hover:text-neutral-950"
          >
            How it works
          </Link>

          <Link
            href="#career-intelligence"
            className="text-sm text-neutral-600 transition hover:text-neutral-950"
          >
            Career Intelligence
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-neutral-700 transition hover:text-neutral-950 sm:block"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}