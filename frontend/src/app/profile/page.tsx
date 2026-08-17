
"use client";

import { useEffect, useMemo, useState } from "react";
import { getProfile, getProfileCompletion, updateProfile, type ProfileData } from "@/lib/api";

type EditableKey = Exclude<keyof ProfileData, "id">;

type FieldConfig = {
  label: string;
  key: EditableKey;
  type?: "text" | "textarea" | "select";
  disabled?: boolean;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

const fields: FieldConfig[] = [
  { label: "Full Name", key: "name", required: true },
  { label: "Email", key: "email", disabled: true },
  { label: "Phone", key: "phone", placeholder: "Add your phone number" },
  { label: "Location", key: "location", placeholder: "City, country" },
  { label: "Career Stage", key: "career_stage", type: "select", options: ["Student", "Early Career", "Mid Career", "Leadership"] },
  { label: "Target Role", key: "target_role", required: true, placeholder: "e.g. Product Manager" },
  { label: "Experience", key: "experience", placeholder: "Years or level" },
  { label: "Career Interest", key: "career_interest", placeholder: "What you want to grow into" },
  { label: "GitHub URL", key: "github_url", placeholder: "https://github.com/yourname" },
  { label: "LinkedIn URL", key: "linkedin_url", placeholder: "https://linkedin.com/in/yourname" },
  { label: "Portfolio URL", key: "portfolio_url", placeholder: "https://yourportfolio.com" },
  { label: "Certifications", key: "certifications", placeholder: "AWS, Google, etc." },
  { label: "Career Goal", key: "career_goal", placeholder: "Describe your next milestone" },
];

const skillOptions = [
  "Python",
  "SQL",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Data Analysis",
  "Product Management",
  "Leadership",
  "Machine Learning",
  "Cloud",
  "UI/UX",
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState({ profile_completion: 0, completed_fields: 0, total_fields: 0 });
  // add near your other useState calls
const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
const [pwSaving, setPwSaving] = useState(false);
const [pwMessage, setPwMessage] = useState("");

const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
  setPwMessage("");
  if (pwForm.next !== pwForm.confirm) {
    setPwMessage("New passwords do not match.");
    return;
  }
  setPwSaving(true);
  try {
    const { changePassword } = await import("@/lib/api");
    const res = await changePassword(pwForm.current, pwForm.next);
    setPwMessage(res.message);
    setPwForm({ current: "", next: "", confirm: "" });
  } catch (err) {
    setPwMessage(err instanceof Error ? err.message : "Failed to update password.");
  } finally {
    setPwSaving(false);
  }
};
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    career_stage: "",
    target_role: "",
    experience: "",
    career_interest: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
    skills: "",
    certifications: "",
    bio: "",
    career_goal: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [data, completionData] = await Promise.all([getProfile(), getProfileCompletion()]);
        setProfile({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          location: data.location ?? "",
          career_stage: data.career_stage ?? "",
          target_role: data.target_role ?? "",
          experience: data.experience ?? "",
          career_interest: data.career_interest ?? "",
          github_url: data.github_url ?? "",
          linkedin_url: data.linkedin_url ?? "",
          portfolio_url: data.portfolio_url ?? "",
          skills: data.skills ?? "",
          certifications: data.certifications ?? "",
          bio: data.bio ?? "",
          career_goal: data.career_goal ?? "",
        });
        setCompletion(completionData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedSkills = useMemo(() => {
    return (profile.skills || "")
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean);
  }, [profile.skills]);

  const completionLabel = completion.profile_completion >= 80 ? "Nearly complete" : completion.profile_completion >= 50 ? "Good progress" : "Start filling in key details";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const key = e.target.name as EditableKey;
    setProfile(prev => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const toggleSkill = (skill: string) => {
    const normalized = selectedSkills.includes(skill)
      ? selectedSkills.filter(item => item !== skill)
      : [...selectedSkills, skill];

    setProfile(prev => ({
      ...prev,
      skills: normalized.join(", "),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      alert("Profile updated successfully.");
      const refreshed = await getProfileCompletion();
      setCompletion(refreshed);
    } catch {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-10">
      <div className="mx-auto max-w-6xl rounded-4xl border border-neutral-200 bg-white p-8 shadow-sm lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">Profile setup</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">Tell us about your next chapter</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">Complete the essentials first, then add optional details to make your profile more compelling for opportunities and resume guidance.</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-600">Profile completion</p>
                <p className="text-3xl font-semibold text-neutral-950">{completion.profile_completion}%</p>
              </div>
              <div className="h-14 w-14 rounded-full border-[7px] border-neutral-200 border-t-neutral-950" style={{ transform: "rotate(45deg)" }} />
            </div>
            <p className="mt-3 text-sm text-neutral-600">{completionLabel}</p>
            <p className="mt-1 text-sm text-neutral-500">{completion.completed_fields} of {completion.total_fields} fields completed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <section className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-neutral-950">Required information</h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600">Priority</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {fields.filter(field => field.required).map(field => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.key}
                      value={profile[field.key] ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-neutral-950"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input
                      name={field.key}
                      value={profile[field.key] ?? ""}
                      disabled={field.disabled}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-neutral-950 disabled:bg-neutral-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-950">Optional details</h2>
            <p className="mt-2 text-sm text-neutral-600">Polish your profile with experience, links, and goals to stand out.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {fields.filter(field => !field.required).map(field => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.key}
                      value={profile[field.key] ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-neutral-950"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input
                      name={field.key}
                      value={profile[field.key] ?? ""}
                      disabled={field.disabled}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-neutral-950 disabled:bg-neutral-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-950">Skill selection</h2>
            <p className="mt-2 text-sm text-neutral-600">Choose the skills that best match your next role and career direction.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {skillOptions.map(skill => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-950">About you</h2>
            <textarea
              rows={5}
              name="bio"
              value={profile.bio ?? ""}
              onChange={handleChange}
              placeholder="Share a quick summary of your background and strengths"
              className="mt-4 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-neutral-950"
            />
          </section>
          {/* Change password section — add inside <form> or as a separate <section> */}
<section className="rounded-3xl border border-neutral-200 p-6">
  <h2 className="text-lg font-semibold text-neutral-950">Change password</h2>
  <div className="mt-4 grid gap-4 md:grid-cols-3">
    <input
      type="password"
      placeholder="Current password"
      value={pwForm.current}
      onChange={(e) => setPwForm(prev => ({ ...prev, current: e.target.value }))}
      className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-950"
    />
    <input
      type="password"
      placeholder="New password"
      value={pwForm.next}
      onChange={(e) => setPwForm(prev => ({ ...prev, next: e.target.value }))}
      className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-950"
    />
    <input
      type="password"
      placeholder="Confirm new password"
      value={pwForm.confirm}
      onChange={(e) => setPwForm(prev => ({ ...prev, confirm: e.target.value }))}
      className="rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-950"
    />
  </div>
  {pwMessage && <p className="mt-3 text-sm text-neutral-700">{pwMessage}</p>}
  <button
    type="button"
    onClick={handlePasswordChange}
    disabled={pwSaving}
    className="mt-4 rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-70"
  >
    {pwSaving ? "Updating..." : "Update password"}
  </button>
</section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">Tip: filling your target role and skills improves the dashboard recommendations.</p>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
