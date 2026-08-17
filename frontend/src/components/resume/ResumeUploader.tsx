"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { uploadResume, type ResumeOut } from "@/lib/api";

export default function ResumeUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<ResumeOut | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const selectFile = (file?: File) => {
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setResult(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleAnalyse = async () => {
    if (!selectedFile) return;

    setIsAnalysing(true);
    setError("");

    try {
      const data = await uploadResume(selectedFile);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyse resume. Please try again."
      );
    } finally {
      setIsAnalysing(false);
    }
  };

  if (result) {
    const score = Math.round(result.ats_score ?? 0);
    const breakdown = result.ats_breakdown;
    const parsed = result.parsed_data;

    const statusLabel =
      score >= 80
        ? "Strong foundation"
        : score >= 60
        ? "Good foundation"
        : "Needs improvement";

    const insights = buildResumeInsights(parsed, breakdown);

    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-neutral-200 bg-white">
          <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 p-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-neutral-500">Resume score</p>

              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-tight text-neutral-950">
                  {score}
                </span>

                <span className="mb-2 text-lg text-neutral-400">/100</span>
              </div>
            </div>

            <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
              {statusLabel}
            </span>
          </div>

          <div className="grid md:grid-cols-3">
            <ResumeMetric
              label="Section completeness"
              score={Math.round(breakdown?.section_completeness ?? 0)}
            />
            <ResumeMetric
              label="Keyword strength"
              score={Math.round(breakdown?.keyword_match ?? 0)}
            />
            <ResumeMetric
              label="Formatting"
              score={Math.round(breakdown?.formatting ?? 0)}
              last
            />
          </div>
        </div>

        {parsed && parsed.skills.length > 0 && (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8">
            <p className="text-sm font-medium text-neutral-500">Detected skills</p>

            <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
              What we found in your resume.
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {parsed.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-sm capitalize text-neutral-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-sm font-medium text-neutral-500">
            Resume intelligence
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            What needs your attention.
          </h2>

          <div className="mt-8">
            {insights.map((insight, index) => (
              <ResumeInsight
                key={insight.title}
                number={String(index + 1).padStart(2, "0")}
                title={insight.title}
                description={insight.description}
                priority={insight.priority}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setResult(null);
          }}
          className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
        >
          ← Analyse another resume
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition ${
          isDragging
            ? "border-neutral-950 bg-neutral-50"
            : "border-neutral-300 bg-neutral-50/50"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-xl text-white">
          ↑
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950">
          Upload your resume
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">
          Add your latest resume to understand its quality, professional
          signals, and alignment with your career goals.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-7 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition hover:border-neutral-400"
        >
          Choose file
        </button>

        <p className="mt-4 text-xs text-neutral-400">PDF, DOCX, or TXT</p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {selectedFile && (
        <div className="mt-6 flex flex-col justify-between gap-5 rounded-2xl border border-neutral-200 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-neutral-950">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-sm text-neutral-500 transition hover:text-neutral-950"
            >
              Remove
            </button>

            <button
              type="button"
              onClick={handleAnalyse}
              disabled={isAnalysing}
              className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:bg-neutral-500"
            >
              {isAnalysing ? "Analysing..." : "Analyse resume"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function buildResumeInsights(
  parsed: ResumeOut["parsed_data"],
  breakdown: ResumeOut["ats_breakdown"]
) {
  const insights: {
    title: string;
    description: string;
    priority: string;
  }[] = [];

  if (!parsed?.email || !parsed?.phone) {
    insights.push({
      title: "Add complete contact information",
      description:
        "We couldn't clearly detect both an email address and phone number. Recruiters and ATS systems rely on these to reach you.",
      priority: "High priority",
    });
  }

  if ((breakdown?.section_completeness ?? 0) < 80) {
    insights.push({
      title: "Add missing resume sections",
      description:
        "Your resume is missing one or more standard sections (Experience, Education, Skills, Projects). Complete sections score higher with ATS systems.",
      priority: "High priority",
    });
  }

  if ((parsed?.skills.length ?? 0) < 5) {
    insights.push({
      title: "List more relevant technical skills",
      description:
        "Only a handful of recognised skills were detected. Add a dedicated skills section covering the tools and technologies you're proficient in.",
      priority: "Medium priority",
    });
  }

  if ((breakdown?.formatting ?? 0) < 80) {
    insights.push({
      title: "Improve resume length and formatting",
      description:
        "Your resume may be too short or too long for ATS parsing. Aim for a focused one-to-two page resume with clear section headers.",
      priority: "Medium priority",
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: "Strong resume structure",
      description:
        "Your resume covers the core sections, contact details, and a solid set of skills. Keep it updated as you gain new experience.",
      priority: "Low priority",
    });
  }

  return insights;
}

function ResumeMetric({
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

function ResumeInsight({
  number,
  title,
  description,
  priority,
}: {
  number: string;
  title: string;
  description: string;
  priority: string;
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

      <span className="h-fit rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
        {priority}
      </span>
    </article>
  );
}
