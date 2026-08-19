"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResetLink("");
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }
      if (data.reset_link) {
        setResetLink(data.reset_link);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your email and we'll help you reset it."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {resetLink && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
            <p className="mb-2 text-neutral-600">
              Reset link (temporary — normally this would be emailed):
            </p>
            <a
              href={resetLink}
              className="break-all font-medium text-neutral-950 underline"
            >
              {resetLink}
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-neutral-950 hover:underline"
        >
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}