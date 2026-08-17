"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CareerScoreCard from "@/components/dashboard/CareerScoreCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PriorityActions from "@/components/dashboard/PriorityActions";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { API_URL, getProfileCompletion } from "@/lib/api";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

type User = {
  id: number;
  name: string;
  email: string;
  career_stage: string | null;
  target_role: string | null;
  skills: string | null;
  career_goal: string | null;
  onboarding_completed: boolean;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        const data = await response.json();
        const profileCompletion = await getProfileCompletion().catch(() => ({ profile_completion: 0 }));

        setUser(data);
        setCompletion(profileCompletion.profile_completion ?? 0);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">
          Loading career workspace...
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
          <DashboardHeader name={user.name} completion={completion} />

          <div className="mt-10 space-y-10">
            <CareerScoreCard />
            
            <DashboardCharts />

            <QuickActions />

            <PriorityActions />
          </div>
        </div>
      </div>
    </main>
  );
}