"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMe,
  getAdminStats,
  getAdminUsers,
  getAdminAnalyses,
  getAdminResumes,
  AdminStats,
  AdminUserRow,
  AdminAnalysisRow,
  AdminResumeRow,
} from "@/lib/api";

type Tab = "overview" | "users" | "analyses" | "resumes";

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [analyses, setAnalyses] = useState<AdminAnalysisRow[]>([]);
  const [resumes, setResumes] = useState<AdminResumeRow[]>([]);

  // Check auth + admin role
  useEffect(() => {
    getMe()
      .then((user) => {
        if (user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setIsAdmin(true);
        setAuthChecked(true);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  // Load data once confirmed admin
  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getAdminStats(),
      getAdminUsers(),
      getAdminAnalyses(),
      getAdminResumes(),
    ])
      .then(([s, u, a, r]) => {
        setStats(s);
        setUsers(u);
        setAnalyses(a);
        setResumes(r);
      })
      .catch(() => {
        setError("Failed to load admin data. Please refresh.");
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">Platform overview and management</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(["overview", "users", "analyses", "resumes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!loading && !error && (
        <>
          {tab === "overview" && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard label="Total Users" value={stats.total_users} />
              <StatCard label="Total Resumes" value={stats.total_resumes} />
              <StatCard label="Total Analyses" value={stats.total_analyses} />
              <StatCard
                label="Avg ATS Score"
                value={stats.avg_ats_score !== null ? `${stats.avg_ats_score}%` : "—"}
              />
              <StatCard
                label="Avg Match Score"
                value={stats.avg_match_score !== null ? `${stats.avg_match_score}%` : "—"}
              />
            </div>
          )}

          {tab === "users" && (
            <Table
              columns={["Name", "Email", "Role", "Resumes", "Joined"]}
              rows={users.map((u) => [
                u.name,
                u.email,
                u.role,
                String(u.resume_count),
                new Date(u.created_at).toLocaleDateString(),
              ])}
            />
          )}

          {tab === "analyses" && (
            <Table
              columns={["User", "Job Title", "Match Score", "Missing Skills", "Date"]}
              rows={analyses.map((a) => [
                a.user_email,
                a.job_title || "—",
                a.match_score !== null ? `${a.match_score}%` : "—",
                (a.missing_skills || []).slice(0, 3).join(", ") || "—",
                new Date(a.created_at).toLocaleDateString(),
              ])}
            />
          )}

          {tab === "resumes" && (
            <Table
              columns={["User", "Filename", "ATS Score", "Uploaded"]}
              rows={resumes.map((r) => [
                r.user_email,
                r.filename,
                r.ats_score !== null ? `${r.ats_score}%` : "—",
                new Date(r.uploaded_at).toLocaleDateString(),
              ])}
            />
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function Table({ columns, rows }: { columns: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <div className="text-gray-400 italic">No data yet.</div>;
  }
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((c) => (
              <th
                key={c}
                className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-800 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}