"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URL } from "@/lib/api";

const careerStages = [
  "Student",
  "Recent graduate",
  "Early career",
  "Experienced professional",
];

const targetRoles = [
  "Data Analyst",
  "Software Engineer",
  "AI / ML Engineer",
  "Business Analyst",
  "Product Analyst",
  "Other",
];

const skills = [
  "Python",
  "JavaScript",
  "React",
  "SQL",
  "Excel",
  "Power BI",
  "Machine Learning",
  "Data Analysis",
  "Communication",
  "Project Management",
];

const careerGoals = [
  "Get my first job",
  "Switch career paths",
  "Improve my current profile",
  "Prepare for a specific role",
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [careerStage, setCareerStage] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [careerGoal, setCareerGoal] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 4;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((currentSkills) =>
      currentSkills.includes(skill)
        ? currentSkills.filter((item) => item !== skill)
        : [...currentSkills, skill]
    );
  };

  const canContinue =
    (step === 1 && careerStage !== "") ||
    (step === 2 && targetRole !== "") ||
    (step === 3 && selectedSkills.length > 0) ||
    (step === 4 && careerGoal !== "");

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    if (step < totalSteps) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  const handleSubmitProfile = async () => {
    if (!careerGoal) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            career_stage: careerStage,
            target_role: targetRole,
            skills: selectedSkills.join(", "),
            career_goal: careerGoal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update career profile."
        );
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-sm font-semibold text-white">
              CI
            </div>

            <span className="text-lg font-semibold tracking-tight text-neutral-950">
              Career Intelligence
            </span>
          </Link>

          <p className="text-sm text-neutral-500">
            Step {step} of {totalSteps}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="h-1 bg-neutral-100">
          <div
            className="h-full bg-neutral-950 transition-all duration-500"
            style={{
              width: `${(step / totalSteps) * 100}%`,
            }}
          />
        </div>

        <div className="mx-auto max-w-3xl py-20 lg:py-28">
          {step === 1 && (
            <section>
              <p className="text-sm font-medium text-neutral-500">
                Career stage
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Where are you in your career?
              </h1>

              <p className="mt-5 text-lg leading-8 text-neutral-600">
                This helps us understand the professional context behind your
                profile.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {careerStages.map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setCareerStage(stage)}
                    className={`rounded-2xl border p-6 text-left transition ${
                      careerStage === stage
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-lg font-medium">
                      {stage}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <p className="text-sm font-medium text-neutral-500">
                Target role
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Which role are you working towards?
              </h1>

              <p className="mt-5 text-lg leading-8 text-neutral-600">
                Your target role helps us evaluate skill alignment and career
                readiness.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {targetRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`rounded-2xl border p-6 text-left transition ${
                      targetRole === role
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-lg font-medium">
                      {role}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <p className="text-sm font-medium text-neutral-500">
                Current skills
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                What skills do you already have?
              </h1>

              <p className="mt-5 text-lg leading-8 text-neutral-600">
                Select the skills that currently represent your professional
                profile.
              </p>

              <div className="mt-12 flex flex-wrap gap-3">
                {skills.map((skill) => {
                  const isSelected =
                    selectedSkills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
                        isSelected
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <p className="text-sm font-medium text-neutral-500">
                Career goal
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                What do you want to achieve next?
              </h1>

              <p className="mt-5 text-lg leading-8 text-neutral-600">
                Your goal helps us prioritise the guidance shown in your career
                dashboard.
              </p>

              <div className="mt-12 grid gap-4">
                {careerGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setCareerGoal(goal)}
                    className={`rounded-2xl border p-6 text-left transition ${
                      careerGoal === goal
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-lg font-medium">
                      {goal}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {error && (
            <p className="mt-8 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-14 flex items-center justify-between border-t border-neutral-200 pt-8">
            <button
              type="button"
              onClick={() =>
                setStep((currentStep) =>
                  Math.max(1, currentStep - 1)
                )
              }
              disabled={step === 1 || loading}
              className="text-sm font-medium text-neutral-500 transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-0"
            >
              ← Back
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProfile}
                disabled={!careerGoal || loading}
                className="rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {loading
                  ? "Building profile..."
                  : "Build my career profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}