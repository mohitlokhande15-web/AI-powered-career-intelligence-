"use client";

import { useEffect, useState } from "react";
import { getCareerOverview, type CareerOverviewOut } from "@/lib/api";

export default function CareerScoreCard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CareerOverviewOut | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getCareerOverview()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const overallScore = data ? Math.round(data.score) : 0;
  const statusLabel = data
    ? overallScore >= 75
      ? "Strong potential"
      : overallScore >= 45
      ? "Building momentum"
      : "Getting started"
    : "Calculating...";

  const metrics = data?.metrics ?? [
    { label: "Skill Strength", score: 0 },
    { label: "Experience Depth", score: 0 },
    { label: "Resume Completeness", score: 0 },
    { label: "Target Role Alignment", score: 0 },
  ];

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white">
      <div className="flex flex-col justify-between gap-8 border-b border-neutral-200 p-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">
            Career intelligence score
          </p>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-6xl font-semibold tracking-tight text-neutral-950">
              {loading ? "–" : overallScore}
            </span>

            <span className="mb-2 text-lg text-neutral-400">/100</span>
          </div>
        </div>

        <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
          {loading ? "Calculating..." : statusLabel}
        </div>
      </div>

      <div className="grid md:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="border-b border-neutral-200 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <p className="text-sm text-neutral-500">{metric.label}</p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              {loading ? "–" : `${Math.round(metric.score)}%`}
            </p>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-neutral-950 transition-all"
                style={{ width: `${loading ? 0 : metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {!loading && (error || overallScore === 0) && (
        <p className="border-t border-neutral-200 px-8 py-5 text-sm text-neutral-500">
          Upload a resume and set a target role in your profile to see your
          real career intelligence score.
        </p>
      )}
    </section>
  );
}