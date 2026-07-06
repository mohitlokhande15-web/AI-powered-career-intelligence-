import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back."
      description="Log in to continue your career intelligence journey."
    >
      <form className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-800"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-800"
            >
              Password
            </label>

            <Link
              href="#"
              className="text-sm text-neutral-500 transition hover:text-neutral-950"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Log in
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs uppercase tracking-wider text-neutral-400">
          or
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        className="w-full rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
      >
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-neutral-500">
        New to Career Intelligence?{" "}
        <Link
          href="/register"
          className="font-medium text-neutral-950 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}