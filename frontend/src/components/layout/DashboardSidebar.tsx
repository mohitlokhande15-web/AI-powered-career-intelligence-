"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-neutral-200 px-7 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-sm font-semibold text-white">
            CI
          </div>

          <span className="font-semibold tracking-tight text-neutral-950">
            Career Intelligence
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8">
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
      </nav>

      <div className="border-t border-neutral-200 p-5">
        <div className="rounded-2xl bg-neutral-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-sm font-medium text-white">
              ML
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-950">
                Mohit Lokhande
              </p>

              <p className="mt-0.5 text-xs text-neutral-500">
                Student
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}