"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import {
  getResumeHistory,
  getCareerOverview,
  getSalaryEstimate,
  type ResumeOut,
  type CareerOverviewOut,
  type SalaryEstimate,
} from "@/lib/api";

const PIE_COLORS = ["#171717", "#d4d4d4"];

export default function DashboardCharts() {
  const [resumes, setResumes] = useState<ResumeOut[]>([]);
  const [overview, setOverview] = useState<CareerOverviewOut | null>(null);
  const [salary, setSalary] = useState<SalaryEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getResumeHistory().catch(() => []),
      getCareerOverview().catch(() => null),
      getSalaryEstimate().catch(() => null),
    ]).then(([r, o, s]) => {
      setResumes(r);
      setOverview(o);
      setSalary(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
        Loading insights...
      </div>
    );
  }

  const atsTrend = [...resumes]
    .filter((r) => r.ats_score !== null)
    .sort((a, b) => new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime())
    .map((r, i) => ({
      name: `#${i + 1}`,
      score: Math.round(r.ats_score ?? 0),
      date: new Date(r.uploaded_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    }));

  const skillRadarData = overview?.recommended_roles?.[0]
    ? [
        { skill: "Matched", value: overview.recommended_roles[0].matched_skills.length },
        { skill: "Missing", value: overview.recommended_roles[0].missing_skills.length },
      ]
    : [];

  const latestResume = resumes[0];
  const matchedCount = latestResume?.skills_lacking ? undefined : undefined;
  const skillsLackingCount = latestResume?.skills_lacking?.length ?? 0;
  const skillsTotal = latestResume?.parsed_data?.skills?.length ?? 0;
  const skillsAligned = Math.max(skillsTotal - skillsLackingCount, 0);

  const pieData = [
    { name: "Aligned", value: skillsAligned || 1 },
    { name: "Gaps", value: skillsLackingCount },
  ];

  const salaryChartData = salary
    ? [
        { label: "Low", value: salary.low },
        { label: "Estimated", value: salary.mid },
        { label: "High", value: salary.high },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ATS Score Trend */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-neutral-700">ATS score trend</p>
        <p className="mt-1 text-xs text-neutral-400">Across your uploaded resume versions</p>
        {atsTrend.length > 1 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={atsTrend} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }}
                formatter={(v: number) => [`${v}/100`, "ATS score"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
              />
              <Line type="monotone" dataKey="score" stroke="#171717" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="mt-8 py-10 text-center text-sm text-neutral-400">
            Upload at least two resume versions to see your trend.
          </div>
        )}
      </div>

      {/* Skill gap donut */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-neutral-700">Skill alignment</p>
        <p className="mt-1 text-xs text-neutral-400">Aligned skills vs. gaps on your latest resume</p>
        {skillsTotal > 0 ? (
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-950" />
                Aligned — {skillsAligned}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                Gaps — {skillsLackingCount}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 py-10 text-center text-sm text-neutral-400">
            Upload a resume to see your skill breakdown.
          </div>
        )}
      </div>

      {/* Career readiness radar */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-neutral-700">Readiness by area</p>
        <p className="mt-1 text-xs text-neutral-400">Career intelligence metric breakdown</p>
        {overview?.metrics && overview.metrics.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={overview.metrics} outerRadius={80}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "#737373" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#a3a3a3" }} />
              <Radar dataKey="score" stroke="#171717" fill="#171717" fillOpacity={0.25} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="mt-8 py-10 text-center text-sm text-neutral-400">
            Set a target role in your profile to see readiness by area.
          </div>
        )}
      </div>

      {/* Salary estimate */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6">
        <p className="text-sm font-medium text-neutral-700">Estimated salary range</p>
        <p className="mt-1 text-xs text-neutral-400">
          {salary ? `${salary.role} · ${salary.location}` : "Set a target role and location for an estimate"}
        </p>
        {salary ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={salaryChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e5e5", fontSize: 12 }}
                  formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Annual"]}
                />
                <Bar dataKey="value" fill="#171717" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-neutral-400">{salary.disclaimer}</p>
          </>
        ) : (
          <div className="mt-8 py-10 text-center text-sm text-neutral-400">
            Complete your profile to see an estimated salary range.
          </div>
        )}
      </div>
    </div>
  );
}