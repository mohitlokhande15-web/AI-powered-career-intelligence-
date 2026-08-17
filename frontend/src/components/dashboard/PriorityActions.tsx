"use client";

import { useEffect, useState } from "react";
import {
  getProfile,
  getSkillGap,
  getCareerOverview,
  type SkillGapResponse,
} from "@/lib/api";

type Priority = {
  title: string;
  description: string;
  impact: string;
};

export default function PriorityActions() {
  const [loading, setLoading] = useState(true);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getProfile();
        setTargetRole(profile.target_role);

        if (profile.target_role) {
          const gap: SkillGapResponse = await getSkillGap(profile.target_role);
          setPriorities(buildPrioritiesFromSkillGap(gap));
          return;
        }

        // No target role set — fall back to the career engine's roadmap
        const overview = await getCareerOverview().catch(() => null);
        if (overview && overview.roadmap.length > 0) {
          setPriorities(
            overview.roadmap.slice(0, 3).map((item, index) => ({
              title: item.title,
              description: item.description,
              impact: index === 0 ? "High impact" : "Medium impact",
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Career guidance
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
          Your priority actions.
        </h2>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading guidance...</p>
      ) : priorities.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          {targetRole
            ? `Your skills already align well with ${targetRole}. Keep your resume and profile up to date to maintain your readiness.`
            : "Upload a resume and set a target role in your profile to get personalised priority actions."}
        </p>
      ) : (
        <div className="mt-8">
          {priorities.map((priority, index) => (
            <article
              key={priority.title}
              className="grid gap-5 border-t border-neutral-200 py-7 sm:grid-cols-[48px_1fr_auto]"
            >
              <span className="text-sm font-medium text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-medium text-neutral-950">
                  {priority.title}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                  {priority.description}
                </p>
              </div>

              <span className="h-fit rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                {priority.impact}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function buildPrioritiesFromSkillGap(gap: SkillGapResponse): Priority[] {
  return gap.missing_skills.slice(0, 3).map((skill, index) => {
    const course = gap.recommended_courses.find((c) => c.skill === skill);
    return {
      title: `Strengthen ${capitalize(skill)} proficiency`,
      description: course
        ? `${capitalize(skill)} is required for ${gap.target_role}. Consider "${course.title}" on ${course.provider}, then add a project demonstrating it.`
        : `${capitalize(
            skill
          )} is required for ${gap.target_role}. Add a project or credential that demonstrates it.`,
      impact: index === 0 ? "High impact" : "Medium impact",
    };
  });
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}