"use client";

import { useState, useEffect } from "react";
import type { Job } from "@/types/job";
import { buildJobSearchLinks } from "@/lib/jobSearchLinks";

interface JobRecommendationsProps {
  jobs: Job[];
  isLoading?: boolean;
}

export default function JobRecommendations({ jobs, isLoading }: JobRecommendationsProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] ?? null);

  useEffect(() => {
    if (jobs.length > 0) {
      setSelectedJob((prev) => jobs.find((j) => j.id === prev?.id) ?? jobs[0]);
    }
  }, [jobs]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
        Loading recommended roles...
      </div>
    );
  }

  if (!selectedJob || jobs.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
        No job recommendations yet — upload a resume to get matched roles.
      </div>
    );
  }

  const searchLinks = buildJobSearchLinks(
    selectedJob.title,
    selectedJob.company,
    selectedJob.location
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px] xl:items-start">
      {/* LEFT: independently scrolling job list */}
      <section className="space-y-4 xl:h-[calc(100vh-14rem)] xl:overflow-y-auto xl:pr-2">
        {jobs.map((job) => {
          const isSelected = selectedJob.id === job.id;

          return (
            <button
              key={job.id}
              type="button"
              onClick={() => setSelectedJob(job)}
              className={`w-full rounded-3xl border bg-white p-7 text-left transition ${
                isSelected
                  ? "border-neutral-950"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white">
                    {job.initials}
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500">{job.company}</p>

                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
                      {job.title}
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                      {job.location} · {job.workMode}
                    </p>
                  </div>
                </div>

                <span className="h-fit rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                  {job.match}% match
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </section>

      {/* RIGHT: sticky detail panel, scrolls independently if content overflows */}
      <aside className="rounded-3xl border border-neutral-200 bg-white p-8 xl:sticky xl:top-8 xl:h-[calc(100vh-14rem)] xl:overflow-y-auto">
        <div className="flex items-start justify-between gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-sm font-semibold text-white">
            {selectedJob.initials}
          </div>

          <span className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white">
            {selectedJob.match}% match
          </span>
        </div>

        <p className="mt-8 text-sm text-neutral-500">{selectedJob.company}</p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
          {selectedJob.title}
        </h2>

        <p className="mt-3 text-sm text-neutral-500">
          {selectedJob.location} · {selectedJob.workMode}
        </p>

        <p className="mt-7 text-sm leading-7 text-neutral-600">
          {selectedJob.description}
        </p>

        <div className="mt-8 border-t border-neutral-200 pt-7">
          <p className="text-sm font-medium text-neutral-950">
            Skills already aligned
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedJob.skills.length > 0 ? (
              selectedJob.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs text-neutral-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No overlap detected yet.</p>
            )}
          </div>
        </div>

        <div className="mt-7 border-t border-neutral-200 pt-7">
          <p className="text-sm font-medium text-neutral-950">
            Skills affecting your match
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedJob.missingSkills.length > 0 ? (
              selectedJob.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-neutral-300 px-3 py-2 text-xs text-neutral-600"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No gaps detected.</p>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-2">
          {selectedJob.url && (
            <a
              href={selectedJob.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-neutral-950 px-6 py-3.5 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              View original listing
            </a>
          )}

          <p className="pt-2 text-xs font-medium text-neutral-400">
            Or search for similar roles
          </p>

          <div className="grid grid-cols-2 gap-2">
            {searchLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-300 px-4 py-2.5 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}