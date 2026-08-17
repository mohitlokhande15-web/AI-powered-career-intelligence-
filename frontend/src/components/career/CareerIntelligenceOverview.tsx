"use client";

import { useEffect, useState } from "react";
import { getCareerOverview, type CareerOverviewOut } from "@/lib/api";

export default function CareerIntelligenceOverview() {
  const [data, setData] = useState<CareerOverviewOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getCareerOverview()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load career intelligence data."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-sm text-neutral-500">
        Loading career intelligence...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-sm text-red-600">
        {error || "No career data available yet. Upload a resume to get started."}
      </div>
    );
  }

  const score = Math.round(data.score);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-neutral-950 text-white">
        <div className="grid lg:grid-cols-[1fr_420px]">
          <div className="p-8 lg:p-10">
            <p className="text-sm text-neutral-400">
              Career intelligence score
            </p>

            <div className="mt-5 flex items-end gap-3">
              <span className="text-7xl font-semibold tracking-tight">{score}</span>
              <span className="mb-2 text-xl text-neutral-500">/100</span>
            </div>

            <h2 className="mt-10 max-w-xl text-3xl font-semibold tracking-tight">
              {data.headline}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">
              {data.summary}
            </p>
          </div>

          <div className="border-t border-neutral-800 lg:border-l lg:border-t-0">
            {data.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-b border-neutral-800 p-6 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-400">{metric.label}</p>
                  <span className="text-lg font-medium">
                    {Math.round(metric.score)}%
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <IntelligenceList
          label="Professional strengths"
          title="What is working in your profile."
          items={data.strengths}
        />

        <IntelligenceList
          label="Profile limitations"
          title="What is holding you back."
          items={data.limitations}
          showSeverity
        />
      </div>

      {data.recommended_roles.length > 0 && (
        <section className="rounded-3xl border border-neutral-200 bg-white p-8 lg:p-10">
          <p className="text-sm font-medium text-neutral-500">
            Career path recommendations
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            Roles matched to your current profile.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {data.recommended_roles.map((role) => (
              <article
                key={role.role}
                className="rounded-2xl border border-neutral-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-neutral-950">{role.role}</h3>
                  <span className="text-sm font-medium text-neutral-500">
                    {Math.round(role.match_score)}%
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-950"
                    style={{ width: `${role.match_score}%` }}
                  />
                </div>

                {role.missing_skills.length > 0 && (
                  <p className="mt-4 text-xs text-neutral-500">
                    Missing: {role.missing_skills.slice(0, 3).join(", ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-neutral-200 bg-white p-8 lg:p-10">
        <p className="text-sm font-medium text-neutral-500">
          Career progression roadmap
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          Your highest-impact path forward.
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
          These actions are ordered by their expected impact on your career
          readiness and alignment with your target role.
        </p>

        <div className="mt-10">
          {data.roadmap.map((item) => (
            <article
              key={item.number}
              className="grid gap-5 border-t border-neutral-200 py-8 md:grid-cols-[60px_100px_1fr]"
            >
              <span className="text-sm font-medium text-neutral-400">
                {item.number}
              </span>

              <span className="h-fit w-fit rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                {item.period}
              </span>

              <div>
                <h3 className="text-lg font-medium text-neutral-950">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Professional diagnosis
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950">
              {data.headline}
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-600">
              {data.summary}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-950 p-6 text-white">
            <p className="text-sm text-neutral-400">Current profile stage</p>
            <p className="mt-3 text-xl font-semibold">{data.profile_stage}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function IntelligenceList({
  label,
  title,
  items,
  showSeverity = false,
}: {
  label: string;
  title: string;
  items: {
    title: string;
    description: string;
    severity?: string | null;
  }[];
  showSeverity?: boolean;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8">
      <p className="text-sm font-medium text-neutral-500">{label}</p>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>

      <div className="mt-8">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="border-t border-neutral-200 py-6"
          >
            <div className="flex items-start gap-5">
              <span className="mt-0.5 text-sm font-medium text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-medium text-neutral-950">
                    {item.title}
                  </h3>

                  {showSeverity && item.severity && (
                    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                      {item.severity}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}