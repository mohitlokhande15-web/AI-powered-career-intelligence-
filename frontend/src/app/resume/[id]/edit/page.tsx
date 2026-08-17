"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getResume,
  updateResume,
  type ResumeOut,
  type ParsedResumeData,
  type EducationEntry,
  type ExperienceEntry,
  type ProjectEntry,
  type CertificationEntry,
} from "@/lib/api";

const TEMPLATES = [
  { name: "Classic", accent: "#171717", font: "font-sans" },
  { name: "Navy", accent: "#1e3a8a", font: "font-sans" },
  { name: "Forest", accent: "#166534", font: "font-sans" },
  { name: "Slate Serif", accent: "#334155", font: "font-serif" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyParsedData(): ParsedResumeData {
  return {
    name: null,
    email: null,
    phone: null,
    location: null,
    linkedin_url: null,
    github_url: null,
    portfolio_url: null,
    summary: null,
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    sections_found: [],
    word_count: null,
  };
}

export default function ResumeEditPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = Number(params.id);

  const [resume, setResume] = useState<ResumeOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [filename, setFilename] = useState("");
  const [editingFilename, setEditingFilename] = useState(false);
  const [data, setData] = useState<ParsedResumeData>(emptyParsedData());

  useEffect(() => {
    getResume(resumeId)
      .then((res) => {
        setResume(res);
        setFilename(res.filename || "");
        const parsed = { ...emptyParsedData(), ...(res.parsed_data ?? {}) };
        setData({
          ...parsed,
          education: (parsed.education ?? []).map((e) => ({ ...e, id: e.id || uid() })),
          experience: (parsed.experience ?? []).map((x) => ({ ...x, id: x.id || uid() })),
          projects: (parsed.projects ?? []).map((p) => ({ ...p, id: p.id || uid() })),
          certifications: (parsed.certifications ?? []).map((c) => ({ ...c, id: c.id || uid() })),
        });
      })
      .catch(() => setError("Could not load this resume."))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const update = <K extends keyof ParsedResumeData>(key: K, value: ParsedResumeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await updateResume(resumeId, data, filename);
      setResume(updated);
      setFilename(updated.filename || "");
      if (updated.parsed_data) {
        const parsed = { ...emptyParsedData(), ...updated.parsed_data };
        setData({
          ...parsed,
          education: (parsed.education ?? []).map((e) => ({ ...e, id: e.id || uid() })),
          experience: (parsed.experience ?? []).map((x) => ({ ...x, id: x.id || uid() })),
          projects: (parsed.projects ?? []).map((p) => ({ ...p, id: p.id || uid() })),
          certifications: (parsed.certifications ?? []).map((c) => ({ ...c, id: c.id || uid() })),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Loading resume...</p>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-red-600">{error || "Resume not found."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <button
              type="button"
              onClick={() => router.push("/resume/history")}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-950"
            >
              ← Back to history
            </button>

            {editingFilename ? (
              <input
                autoFocus
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onBlur={() => setEditingFilename(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingFilename(false);
                }}
                className="mt-3 w-full max-w-md rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-2xl font-semibold tracking-tight text-neutral-950 outline-none focus:border-neutral-950"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingFilename(true)}
                className="group mt-3 flex items-center gap-2 text-left"
              >
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                  {filename || resume.filename}
                </h1>
                <span className="text-sm text-neutral-400 opacity-0 transition group-hover:opacity-100">
                  Edit
                </span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm font-medium text-green-600">Saved</span>}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* LEFT: editing panel */}
          <div className="space-y-6">
            <Section title="Contact info">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={data.name ?? ""} onChange={(v) => update("name", v || null)} />
                <Field label="Email" value={data.email ?? ""} onChange={(v) => update("email", v || null)} />
                <Field label="Phone" value={data.phone ?? ""} onChange={(v) => update("phone", v || null)} />
                <Field label="Location" value={data.location ?? ""} onChange={(v) => update("location", v || null)} />
                <Field label="LinkedIn" value={data.linkedin_url ?? ""} onChange={(v) => update("linkedin_url", v || null)} />
                <Field label="GitHub" value={data.github_url ?? ""} onChange={(v) => update("github_url", v || null)} />
                <Field label="Portfolio" value={data.portfolio_url ?? ""} onChange={(v) => update("portfolio_url", v || null)} />
              </div>
            </Section>

            <Section title="Summary">
              <textarea
                value={data.summary ?? ""}
                onChange={(e) => update("summary", e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-950 outline-none transition focus:border-neutral-950"
                placeholder="Short professional summary..."
              />
            </Section>

            <Section title="Skills">
              <TagListEditor items={data.skills} onChange={(v) => update("skills", v)} placeholder="Add a skill..." />
            </Section>

            <Section title="Education">
              <EducationEditor items={data.education} onChange={(v) => update("education", v)} />
            </Section>

            <Section title="Experience & Internships">
              <ExperienceEditor items={data.experience} onChange={(v) => update("experience", v)} />
            </Section>

            <Section title="Projects">
              <ProjectsEditor items={data.projects} onChange={(v) => update("projects", v)} />
            </Section>

            <Section title="Certifications">
              <CertificationsEditor items={data.certifications} onChange={(v) => update("certifications", v)} />
            </Section>

            <Section title="Template">
              <div className="grid grid-cols-4 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`rounded-xl border p-3 text-left text-xs transition ${
                      template.name === t.name ? "border-neutral-950" : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <span className="mb-2 block h-3 w-full rounded-full" style={{ backgroundColor: t.accent }} />
                    {t.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-neutral-400">Cosmetic only — doesn&apos;t affect ATS scoring.</p>
            </Section>
          </div>

          {/* RIGHT: live preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className={`rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm ${template.font}`}>
              <div style={{ borderTop: `4px solid ${template.accent}` }} className="pt-6">
                <h2 className="text-2xl font-semibold text-neutral-950">{data.name || "Your Name"}</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {[data.email, data.phone, data.location].filter(Boolean).join("  ·  ") || "email · phone · location"}
                </p>
                {(data.linkedin_url || data.github_url || data.portfolio_url) && (
                  <p className="mt-1 text-xs text-neutral-400">
                    {[data.linkedin_url, data.github_url, data.portfolio_url].filter(Boolean).join("  ·  ")}
                  </p>
                )}

                {data.summary && (
                  <PreviewSection title="Summary" accent={template.accent}>
                    <p className="text-sm leading-6 text-neutral-700">{data.summary}</p>
                  </PreviewSection>
                )}

                {data.skills.length > 0 && (
                  <PreviewSection title="Skills" accent={template.accent}>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((s, i) => (
                        <span key={i} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {data.education.length > 0 && (
                  <PreviewSection title="Education" accent={template.accent}>
                    <div className="space-y-3">
                      {data.education.map((e) => (
                        <div key={e.id} className="text-sm text-neutral-700">
                          <p className="font-medium text-neutral-900">
                            {e.degree || "Degree"} {e.institution && `— ${e.institution}`}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {[e.start_year, e.end_year].filter(Boolean).join(" – ")}
                            {e.cgpa && `  ·  CGPA: ${e.cgpa}`}
                            {e.percentage && `  ·  ${e.percentage}%`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {data.experience.length > 0 && (
                  <PreviewSection title="Experience" accent={template.accent}>
                    <div className="space-y-4">
                      {data.experience.map((x) => (
                        <div key={x.id} className="text-sm text-neutral-700">
                          <p className="font-medium text-neutral-900">
                            {x.role || "Role"} {x.company && `— ${x.company}`}
                            {x.is_internship && (
                              <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                                Internship
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {[x.start_date, x.end_date].filter(Boolean).join(" – ")}
                          </p>
                          {x.bullets.filter(Boolean).length > 0 && (
                            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-neutral-600">
                              {x.bullets.filter(Boolean).map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {data.projects.length > 0 && (
                  <PreviewSection title="Projects" accent={template.accent}>
                    <div className="space-y-3">
                      {data.projects.map((p) => (
                        <div key={p.id} className="text-sm text-neutral-700">
                          <p className="font-medium text-neutral-900">{p.title || "Project"}</p>
                          {p.description && <p className="text-xs text-neutral-600">{p.description}</p>}
                          {p.tech_stack.length > 0 && (
                            <p className="mt-1 text-xs text-neutral-400">{p.tech_stack.join(", ")}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </PreviewSection>
                )}

                {data.certifications.length > 0 && (
                  <PreviewSection title="Certifications" accent={template.accent}>
                    <ul className="space-y-1 text-sm text-neutral-700">
                      {data.certifications.map((c) => (
                        <li key={c.id}>
                          {c.title} {c.issuer && `— ${c.issuer}`} {c.year && `(${c.year})`}
                        </li>
                      ))}
                    </ul>
                  </PreviewSection>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">Current ATS score</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                {resume.ats_score !== null && resume.ats_score !== undefined ? Math.round(resume.ats_score) : "–"}
                <span className="text-base font-normal text-neutral-400">/100</span>
              </p>
              <p className="mt-1 text-xs text-neutral-400">Recalculated when you save changes.</p>
            </div>

            {resume.improvements && resume.improvements.length > 0 && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <p className="text-sm font-medium text-amber-800">Suggested improvements</p>
                <ul className="mt-3 space-y-1.5 text-sm text-amber-700">
                  {resume.improvements.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Layout helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function PreviewSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
      />
    </label>
  );
}

/* ---------- Tag list (skills) ---------- */

function TagListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const val = draft.trim();
    if (!val) return;
    onChange([...items, val]);
    setDraft("");
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
          >
            {item}
            <button type="button" onClick={() => remove(idx)} className="text-neutral-400 hover:text-neutral-700">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-neutral-950"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ---------- Education ---------- */

function EducationEditor({
  items,
  onChange,
}: {
  items: EducationEntry[];
  onChange: (items: EducationEntry[]) => void;
}) {
  const update = (id: string, patch: Partial<EducationEntry>) => {
    onChange(items.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };
  const remove = (id: string) => onChange(items.filter((e) => e.id !== id));
  const add = () =>
    onChange([
      ...items,
      {
        id: uid(),
        degree: "",
        institution: "",
        location: null,
        start_year: "",
        end_year: "",
        cgpa: null,
        percentage: null,
      },
    ]);

  return (
    <div className="space-y-4">
      {items.map((e) => (
        <div key={e.id} className="rounded-xl border border-neutral-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Degree" value={e.degree} onChange={(v) => update(e.id, { degree: v })} />
            <Field label="Institution" value={e.institution} onChange={(v) => update(e.id, { institution: v })} />
            <Field label="Start year" value={e.start_year} onChange={(v) => update(e.id, { start_year: v })} />
            <Field label="End year" value={e.end_year} onChange={(v) => update(e.id, { end_year: v })} />
            <Field label="CGPA" value={e.cgpa ?? ""} onChange={(v) => update(e.id, { cgpa: v || null })} />
            <Field label="Percentage" value={e.percentage ?? ""} onChange={(v) => update(e.id, { percentage: v || null })} />
          </div>
          <button
            type="button"
            onClick={() => remove(e.id)}
            className="mt-3 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-red-300 hover:text-red-600"
          >
            Remove entry
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-700"
      >
        + Add education
      </button>
    </div>
  );
}

/* ---------- Experience ---------- */

function ExperienceEditor({
  items,
  onChange,
}: {
  items: ExperienceEntry[];
  onChange: (items: ExperienceEntry[]) => void;
}) {
  const update = (id: string, patch: Partial<ExperienceEntry>) => {
    onChange(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };
  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));
  const add = () =>
    onChange([
      ...items,
      {
        id: uid(),
        role: "",
        company: "",
        location: null,
        start_date: "",
        end_date: "",
        is_internship: false,
        bullets: [],
      },
    ]);

  const updateBullet = (id: string, idx: number, val: string) => {
    const entry = items.find((x) => x.id === id);
    if (!entry) return;
    const bullets = entry.bullets.map((b, i) => (i === idx ? val : b));
    update(id, { bullets });
  };
  const addBullet = (id: string) => {
    const entry = items.find((x) => x.id === id);
    if (!entry) return;
    update(id, { bullets: [...entry.bullets, ""] });
  };
  const removeBullet = (id: string, idx: number) => {
    const entry = items.find((x) => x.id === id);
    if (!entry) return;
    update(id, { bullets: entry.bullets.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      {items.map((x) => (
        <div key={x.id} className="rounded-xl border border-neutral-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Role" value={x.role} onChange={(v) => update(x.id, { role: v })} />
            <Field label="Company" value={x.company} onChange={(v) => update(x.id, { company: v })} />
            <Field label="Start date" value={x.start_date} onChange={(v) => update(x.id, { start_date: v })} />
            <Field label="End date" value={x.end_date} onChange={(v) => update(x.id, { end_date: v })} />
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs font-medium text-neutral-600">
            <input
              type="checkbox"
              checked={x.is_internship}
              onChange={(e) => update(x.id, { is_internship: e.target.checked })}
            />
            This was an internship
          </label>

          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">Bullet points</span>
            <div className="space-y-2">
              {x.bullets.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    value={b}
                    onChange={(e) => updateBullet(x.id, idx, e.target.value)}
                    placeholder="e.g. Reduced API latency by 30% by optimizing queries"
                    rows={2}
                    className="flex-1 resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-950"
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(x.id, idx)}
                    className="self-start rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-500 transition hover:border-red-300 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addBullet(x.id)}
                className="rounded-full border border-dashed border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-700"
              >
                + Add bullet
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => remove(x.id)}
            className="mt-4 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-red-300 hover:text-red-600"
          >
            Remove entry
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-700"
      >
        + Add experience / internship
      </button>
    </div>
  );
}

/* ---------- Projects ---------- */

function ProjectsEditor({
  items,
  onChange,
}: {
  items: ProjectEntry[];
  onChange: (items: ProjectEntry[]) => void;
}) {
  const update = (id: string, patch: Partial<ProjectEntry>) => {
    onChange(items.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const remove = (id: string) => onChange(items.filter((p) => p.id !== id));
  const add = () =>
    onChange([...items, { id: uid(), title: "", description: "", tech_stack: [], link: null }]);

  return (
    <div className="space-y-4">
      {items.map((p) => (
        <div key={p.id} className="rounded-xl border border-neutral-200 p-4">
          <Field label="Title" value={p.title} onChange={(v) => update(p.id, { title: v })} />
          <label className="mt-3 block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">Description</span>
            <textarea
              value={p.description}
              onChange={(e) => update(p.id, { description: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none transition focus:border-neutral-950"
            />
          </label>
          <div className="mt-3">
            <Field label="Link" value={p.link ?? ""} onChange={(v) => update(p.id, { link: v || null })} />
          </div>
          <div className="mt-3">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">Tech stack</span>
            <TagListEditor
              items={p.tech_stack}
              onChange={(v) => update(p.id, { tech_stack: v })}
              placeholder="Add a technology..."
            />
          </div>
          <button
            type="button"
            onClick={() => remove(p.id)}
            className="mt-3 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-red-300 hover:text-red-600"
          >
            Remove entry
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-700"
      >
        + Add project
      </button>
    </div>
  );
}

/* ---------- Certifications ---------- */

function CertificationsEditor({
  items,
  onChange,
}: {
  items: CertificationEntry[];
  onChange: (items: CertificationEntry[]) => void;
}) {
  const update = (id: string, patch: Partial<CertificationEntry>) => {
    onChange(items.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const remove = (id: string) => onChange(items.filter((c) => c.id !== id));
  const add = () => onChange([...items, { id: uid(), title: "", issuer: "", year: null }]);

  return (
    <div className="space-y-4">
      {items.map((c) => (
        <div key={c.id} className="rounded-xl border border-neutral-200 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Title" value={c.title} onChange={(v) => update(c.id, { title: v })} />
            <Field label="Issuer" value={c.issuer} onChange={(v) => update(c.id, { issuer: v })} />
            <Field label="Year" value={c.year ?? ""} onChange={(v) => update(c.id, { year: v || null })} />
          </div>
          <button
            type="button"
            onClick={() => remove(c.id)}
            className="mt-3 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-red-300 hover:text-red-600"
          >
            Remove entry
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-700"
      >
        + Add certification
      </button>
    </div>
  );
}