"use client";

import { useEffect, useState } from "react";
import {
  analyzeJobDescription,
  getResumeHistory,
  type JobAnalysisOut,
  type ResumeOut,
} from "@/lib/api";

const sampleJobDescription = `We are looking for a Junior Data Analyst to join our analytics team.

The ideal candidate should have strong SQL skills and experience working with Excel and Power BI.

Responsibilities include analysing business data, creating dashboards, identifying trends, and presenting insights to stakeholders.

Knowledge of Python and statistics is preferred. Candidates should demonstrate strong analytical thinking, communication skills, and experience working on data analysis projects.`;

export default function JobDescriptionAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<JobAnalysisOut | null>(null);
  const [error, setError] = useState("");

  const [resumes, setResumes] = useState<ResumeOut[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | "latest">("latest");
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    getResumeHistory()
      .then((data) => setResumes(data))
      .catch(() => setResumes([]))
      .finally(() => setLoadingResumes(false));
  }, []);

  const handleAnalyse = async () => {
    if (jobDescription.trim().length < 50) return;

    setIsAnalysing(true);
    setError("");

    try {
      const resumeId =
        selectedResumeId === "latest" ? undefined : selectedResumeId;
      const data = await analyzeJobDescription(jobDescription, resumeId);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyse job description. Please try again."
      );
    } finally {
      setIsAnalysing(false);
    }
  };

  const selectedResume =
    selectedResumeId === "latest"
      ? resumes[0]
      : resumes.find((r) => r.id === selectedResumeId);

  if (result) {
    const score = Math.round(result.match_score);
    const statusLabel =
      score >= 75 ? "Strong match" : score >= 45 ? "Partial match" : "Low match";

    const atsScore =
      result.ats_score !== null && result.ats_score !== undefined
        ? Math.round(result.ats_score)
        : null;

    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-neutral-200 bg-white">
          <div className="flex flex-col justify-between gap-8 border-b border-neutral-200 p-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-neutral-500">
                Job match score
                {selectedResume && (
                  <span className="ml-2 text-neutral-400">
                    · compared against {selectedResume.filename}
                  </span>
                )}
              </p>

              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-tight text-neutral-950">
                  {score}
                </span>

                <span className="mb-2 text-lg text-neutral-400">%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {atsScore !== null && (
                <span className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700">
                  ATS score for this role: {atsScore}%
                </span>
              )}

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
                {statusLabel}
              </span>
            </div>
          </div>

          {!result.matched_skills.length && !result.missing_skills.length && (
            <div className="p-8 text-sm text-neutral-500">
              Upload a resume first on the Resume page so we can match it
              against this job description.
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SkillCard
            label="Matched skills"
            title="Your profile already shows."
            skills={result.matched_skills}
            empty="No overlapping skills detected yet."
          />

          <SkillCard
            label="Missing skills"
            title="Skills limiting your match."
            skills={result.missing_skills}
            empty="No missing skills detected — great alignment."
          />
        </div>

        {result.resume_improvements.length > 0 && (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <p className="text-sm font-medium text-neutral-500">
              Professional guidance
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              How to improve your match.
            </h2>

            <div className="mt-8">
              {result.resume_improvements.map((text, index) => (
                <Recommendation
                  key={text}
                  number={String(index + 1).padStart(2, "0")}
                  description={text}
                />
              ))}
            </div>
          </div>
        )}

        {result.recommended_courses.length > 0 && (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <p className="text-sm font-medium text-neutral-500">
              Learning resources
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
              Close the gap with these courses.
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {result.recommended_courses.map((course) => (
                <a
                  key={course.url}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-neutral-200 p-5 transition hover:border-neutral-950"
                >
                  <span className="text-xs font-medium capitalize text-neutral-400">
                    {course.skill}
                  </span>

                  <h3 className="mt-2 font-medium text-neutral-950">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-sm text-neutral-500">
                    {course.provider}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            ← Edit job description
          </button>

          <button
            type="button"
            onClick={() => {
              setJobDescription("");
              setResult(null);
            }}
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            Analyse another job
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Job description
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
          Add the opportunity you are targeting.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
          Paste the complete job description and choose which resume to
          compare it against.
        </p>
      </div>

      <div className="mt-8">
        <label className="text-sm font-medium text-neutral-700">
          Compare against
        </label>

        {loadingResumes ? (
          <p className="mt-3 text-sm text-neutral-500">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            No resumes uploaded yet. Upload one on the Resume page first.
          </p>
        ) : (
          <select
            value={selectedResumeId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedResumeId(val === "latest" ? "latest" : Number(val));
            }}
            className="mt-3 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950 focus:bg-white"
          >
            <option value="latest">
              Most recent resume ({resumes[0]?.filename})
            </option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.filename} · uploaded {new Date(r.uploaded_at).toLocaleDateString()}
                {r.ats_score !== null ? ` · ATS ${Math.round(r.ats_score)}%` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6">
        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Paste the complete job description here..."
          className="min-h-[360px] w-full resize-y rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-sm leading-7 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white"
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            {jobDescription.length} characters
          </p>

          <button
            type="button"
            onClick={() => setJobDescription(sampleJobDescription)}
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            Use sample job description
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex justify-end border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={handleAnalyse}
          disabled={jobDescription.trim().length < 50 || isAnalysing}
          className="rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isAnalysing ? "Analysing job match..." : "Analyse job match"}
        </button>
      </div>
    </section>
  );
}

function SkillCard({
  label,
  title,
  skills,
  empty,
}: {
  label: string;
  title: string;
  skills: string[];
  empty: string;
}) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-8">
      <p className="text-sm font-medium text-neutral-500">{label}</p>

      <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>

      {skills.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm capitalize text-neutral-700"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-neutral-500">{empty}</p>
      )}
    </article>
  );
}

function Recommendation({
  number,
  description,
}: {
  number: string;
  description: string;
}) {
  return (
    <article className="grid gap-5 border-t border-neutral-200 py-7 sm:grid-cols-[48px_1fr]">
      <span className="text-sm font-medium text-neutral-400">{number}</span>

      <p className="max-w-2xl text-sm leading-6 text-neutral-600">
        {description}
      </p>
    </article>
  );
}