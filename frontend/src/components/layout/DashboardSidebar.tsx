"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, createBlankResume, getMe } from "@/lib/api";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
  },
  {
    name: "Resume",
    href: "/resume",
  },
  {
    name: "Resume history",
    href: "/resume/history",
  },
  {
    name: "Job analysis",
    href: "/job-analysis",
  },
  {
    name: "Career intelligence",
    href: "/career-intelligence",
  },
  {
    name: "Jobs",
    href: "/jobs",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getMe()
      .then((user) => setIsAdmin(user.role === "admin"))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleBuildResume = async () => {
    try {
      const resume = await createBlankResume();
      router.push(`/resume/${resume.id}/edit`);
    } catch {
      alert("Could not start a new resume right now.");
    }
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
      <div className="shrink-0 border-b border-neutral-200 px-7 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-sm font-semibold text-white">
            CI
          </div>

          <span className="font-semibold tracking-tight text-neutral-950">
            Career Intelligence
          </span>
        </Link>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-4 py-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <p className="px-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
          Workspace
        </p>

        <div className="mt-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <>
            <p className="mt-8 px-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
              Admin
            </p>

            <div className="mt-4 space-y-1">
              <Link
                href="/admin"
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  pathname === "/admin"
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                Admin Dashboard
              </Link>
            </div>
          </>
        )}

        <p className="mt-8 px-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
          Create
        </p>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleBuildResume}
            className="flex w-full items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-950"
          >
            <span>+</span>
            Resume Builder
          </button>
        </div>
      </nav>

      <div className="shrink-0 border-t border-neutral-200 p-5">
        <button
          onClick={logout}
          className="w-full rounded-xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}