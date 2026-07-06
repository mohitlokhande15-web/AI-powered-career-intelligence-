"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
    const router = useRouter();

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  router.push("/onboarding");
};
  return (
    <AuthLayout
      title="Start with your career."
      description="Create your profile and begin understanding what can move your career forward."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-neutral-800"
          >
            Full name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Your full name"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

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
          <label
            htmlFor="password"
            className="text-sm font-medium text-neutral-800"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Create a password"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />

          <p className="mt-2 text-xs text-neutral-400">
            Use at least 8 characters.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Create account
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-neutral-950 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}