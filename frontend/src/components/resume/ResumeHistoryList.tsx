"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL, getResumeHistory, type ResumeOut } from "@/lib/api";

export default function ResumeHistoryList() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadResumes = async () => {
    try {
      const data = await getResumeHistory();
      setResumes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resume history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDownload = async (resume: ResumeOut) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/api/resume/${resume.id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      alert("Unable to download this resume right now.");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = resume.filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (resumeId: number) => {
    if (!window.confirm("Remove this resume from your history?")) return;
    setBusyId(resumeId);
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/api/resume/${resumeId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBusyId(null);
    if (!response.ok) {
      alert("Could not delete the resume.");
      return;
    }
    setResumes(prev => prev.filter(resume => resume.id !== resumeId));
  };

  const handleReplace = async (resumeId: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.txt";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setBusyId(resumeId);
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_URL}/api/resume/${resumeId}/replace`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setBusyId(null);
      if (!response.ok) {
        alert("Could not replace the resume.");
        return;
      }
      const updated = await response.json();
      setResumes(prev => prev.map(resume => (resume.id === resumeId ? updated : resume)));
    };
    input.click();
  };

  const summaryStats = useMemo(() => {
    if (resumes.length === 0) return null;
    const averageScore = Math.round(resumes.reduce((sum, resume) => sum + (resume.ats_score ?? 0), 0) / resumes.length);
    return { averageScore };
  }, [resumes]);

  if (loading) {
    return <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">Loading resume history...</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-red-600">{error}</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/50 p-12 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">No resumes analysed yet</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-600">Upload your first resume to see its ATS score here, and track how it improves each time you update it.</p>
        <Link href="/resume" className="mt-7 inline-block rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800">Upload a resume</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-500">Resume insights snapshot</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">Average ATS score: {summaryStats?.averageScore ?? 0}</div>
          <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">{resumes.length} resume versions tracked</div>
        </div>
      </div>

      {resumes.map((resume, index) => {
        const score = Math.round(resume.ats_score ?? 0);
        const date = new Date(resume.uploaded_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
        const skillCount = resume.parsed_data?.skills?.length ?? 0;

        return (
          <div key={resume.id} className={`rounded-3xl border border-neutral-200 bg-white p-6 ${index === 0 ? "shadow-sm" : ""}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-950">{resume.filename}</p>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">{score}/100 ATS</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{resume.summary || "Resume summary will appear here after analysis."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {resume.skills_lacking?.length ? resume.skills_lacking.map(skill => <span key={skill} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Missing: {skill}</span>) : <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Core skills are aligned</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => handleDownload(resume)} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">Download</button>
                <button type="button" onClick={() => router.push(`/resume/${resume.id}/edit`)} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400">Edit</button>
                <button type="button" onClick={() => handleReplace(resume.id)} disabled={busyId === resume.id} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 disabled:opacity-60">{busyId === resume.id ? "Working..." : "Replace"}</button>
                <button type="button" onClick={() => handleDelete(resume.id)} disabled={busyId === resume.id} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60">Delete</button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-700">What needs improvement</p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  {resume.improvements?.length ? resume.improvements.map(item => <li key={item} className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-neutral-950" />{item}</li>) : <li>No improvement notes available yet.</li>}
                </ul>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm font-medium text-neutral-700">Resume snapshot</p>
                <div className="mt-3 space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center justify-between"><span>Uploaded</span><span>{date}</span></div>
                  <div className="flex items-center justify-between"><span>Skills detected</span><span>{skillCount}</span></div>
                  <div className="flex items-center justify-between"><span>ATS score</span><span>{score}</span></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}