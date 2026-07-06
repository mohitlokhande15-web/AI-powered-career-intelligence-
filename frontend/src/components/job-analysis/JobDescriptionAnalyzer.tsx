"use client";

import { useState } from "react";

const sampleJobDescription = `We are looking for a Junior Data Analyst to join our analytics team.

The ideal candidate should have strong SQL skills and experience working with Excel and Power BI.

Responsibilities include analysing business data, creating dashboards, identifying trends, and presenting insights to stakeholders.

Knowledge of Python and statistics is preferred. Candidates should demonstrate strong analytical thinking, communication skills, and experience working on data analysis projects.`;

export default function JobDescriptionAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isAnalysed, setIsAnalysed] = useState(false);

  const handleAnalyse = () => {
    if (jobDescription.trim().length < 50) return;

    setIsAnalysing(true);

    window.setTimeout(() => {
      setIsAnalysing(false);
      setIsAnalysed(true);
    }, 1600);
  };

  if (isAnalysed) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-neutral-200 bg-white">
          <div className="flex flex-col justify-between gap-8 border-b border-neutral-200 p-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-neutral-500">Job match score</p>

              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-tight text-neutral-950">
                  82
                </span>

                <span className="mb-2 text-lg text-neutral-400">%</span>
              </div>
            </div>

            <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
              Strong match
            </span>
          </div>

          <div className="grid md:grid-cols-3">
            <MatchMetric label="Skills match" score={86} />
            <MatchMetric label="Experience alignment" score={72} />
            <MatchMetric label="Profile relevance" score={88} last />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SkillCard
            label="Matched skills"
            title="Your profile already shows."
            skills={["Python", "Excel", "Data Analysis", "Communication"]}
          />

          <SkillCard
            label="Missing skills"
            title="Skills limiting your match."
            skills={["SQL", "Power BI", "Statistics"]}
          />
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm font-medium text-neutral-500">
            Professional guidance
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            How to improve your match.
          </h2>

          <div className="mt-8">
            <Recommendation
              number="01"
              title="Demonstrate SQL through a practical project"
              description="SQL is a core requirement for this opportunity. Add a project showing queries, data cleaning, joins, and business analysis."
              impact="+7% potential match"
            />

            <Recommendation
              number="02"
              title="Add Power BI dashboard evidence"
              description="The role specifically expects dashboard creation. Build and document one analytics dashboard with measurable business insights."
              impact="+5% potential match"
            />

            <Recommendation
              number="03"
              title="Strengthen statistics evidence"
              description="Show practical use of descriptive statistics, trend analysis, or hypothesis-based reasoning inside an analytics project."
              impact="+3% potential match"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setIsAnalysed(false)}
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            ← Edit job description
          </button>

          <button
            type="button"
            onClick={() => {
              setJobDescription("");
              setIsAnalysed(false);
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
          Paste the complete job description. Career Intelligence will compare
          the role requirements with your current career profile.
        </p>
      </div>

      <div className="mt-8">
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

      <div className="mt-8 flex justify-end border-t border-neutral-200 pt-6">
        <button
          type="button"
          onClick={handleAnalyse}
          disabled={
            jobDescription.trim().length < 50 || isAnalysing
          }
          className="rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isAnalysing ? "Analysing job match..." : "Analyse job match"}
        </button>
      </div>
    </section>
  );
}

function MatchMetric({
  label,
  score,
  last = false,
}: {
  label: string;
  score: number;
  last?: boolean;
}) {
  return (
    <div
      className={`border-b border-neutral-200 p-6 md:border-b-0 ${
        last ? "" : "md:border-r"
      }`}
    >
      <p className="text-sm text-neutral-500">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
        {score}%
      </p>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-neutral-950"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function SkillCard({
  label,
  title,
  skills,
}: {
  label: string;
  title: string;
  skills: string[];
}) {
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-8">
      <p className="text-sm font-medium text-neutral-500">{label}</p>

      <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>

      <div className="mt-8 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

function Recommendation({
  number,
  title,
  description,
  impact,
}: {
  number: string;
  title: string;
  description: string;
  impact: string;
}) {
  return (
    <article className="grid gap-5 border-t border-neutral-200 py-7 sm:grid-cols-[48px_1fr_auto]">
      <span className="text-sm font-medium text-neutral-400">{number}</span>

      <div>
        <h3 className="font-medium text-neutral-950">{title}</h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>

      <span className="h-fit whitespace-nowrap rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
        {impact}
      </span>
    </article>
  );
}