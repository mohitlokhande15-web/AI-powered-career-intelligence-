export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* =========================
   TYPES
========================= */

export interface ProfileData {
  id?: number;

  name: string;
  email: string;

  phone: string | null;
  location: string | null;

  career_stage: string | null;
  target_role: string | null;
  experience: string | null;
  career_interest: string | null;

  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;

  skills: string | null;
  certifications: string | null;

  bio: string | null;

  career_goal: string | null;
}

/* =========================
   API REQUEST
========================= */

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const doFetch = async (token: string | null) => {
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
  };

  let token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  let response = await doFetch(token);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await doFetch(newToken);
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

/* =========================
   PROFILE API
========================= */

export function getProfile() {
  return apiRequest<ProfileData>("/api/profile");
}

export function updateProfile(data: Partial<ProfileData>) {
  return apiRequest<ProfileData>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function getProfileCompletion() {
  return apiRequest<{
    profile_completion: number;
    completed_fields: number;
    total_fields: number;
  }>("/api/profile/completion");
}

/* =========================
   FORM-DATA REQUEST (file uploads)
========================= */

async function apiFormRequest<T>(
  endpoint: string,
  formData: FormData,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    body: formData,
  });

  if (!response.ok) {
    let detail = `API request failed: ${response.status}`;
    try {
      const errBody = await response.json();
      detail = errBody.detail || detail;
    } catch {
      // response wasn't JSON — keep default message
    }
    throw new Error(detail);
  }

  return response.json();
}

/* =========================
   RESUME API
========================= */

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  start_year: string;
  end_year: string;
  cgpa: string | null;
  percentage: string | null;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string;
  is_internship: boolean;
  bullets: string[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  link: string | null;
}

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  year: string | null;
}

export interface ParsedResumeData {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  summary: string | null;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections_found: string[];
  word_count?: number | null;
}

export interface ATSBreakdown {
  keyword_match: number;
  formatting: number;
  section_completeness: number;
  readability: number;
  contact_info: number;
}

export interface ResumeOut {
  id: number;
  filename: string;
  raw_text?: string | null;
  parsed_data: ParsedResumeData | null;
  ats_score: number | null;
  ats_breakdown: ATSBreakdown | null;
  uploaded_at: string;
  summary?: string | null;
  skills_lacking?: string[];
  improvements?: string[];
}

export function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFormRequest<ResumeOut>("/api/resume/upload", formData);
}

export function getResumeHistory() {
  return apiRequest<ResumeOut[]>("/api/resume/history");
}

export function getResume(id: number) {
  return apiRequest<ResumeOut>(`/api/resume/${id}`);
}

export function updateResume(id: number, parsed_data: ParsedResumeData, filename?: string) {
  return apiRequest<ResumeOut>(`/api/resume/${id}`, {
    method: "PUT",
    body: JSON.stringify({ parsed_data, filename }),
  });
}

export interface ResumeScorePreview {
  ats_score: number;
  breakdown: ATSBreakdown;
}

export function previewResumeScore(
  id: number,
  parsed_data: ParsedResumeData,
  jobDescription?: string
) {
  return apiRequest<ResumeScorePreview>(`/api/resume/${id}/score-preview`, {
    method: "POST",
    body: JSON.stringify({ parsed_data, job_description: jobDescription }),
  });
}

/* =========================
   JOB ANALYSIS API
========================= */

export interface JobAnalysisOut {
  id: number;
  job_title: string | null;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  ats_score: number | null;
  recommended_courses: { skill: string; title: string; provider: string; url: string }[];
  resume_improvements: string[];
}

export function analyzeJobDescription(
  jobDescription: string,
  resumeId?: number,
  jobTitle?: string
) {
  return apiRequest<JobAnalysisOut>("/api/job-analysis", {
    method: "POST",
    body: JSON.stringify({
      job_description: jobDescription,
      resume_id: resumeId,
      job_title: jobTitle,
    }),
  });
}

/* =========================
   SKILL GAP / CAREER API
========================= */

export interface SkillGapResponse {
  target_role: string;
  have_skills: string[];
  missing_skills: string[];
  recommended_courses: { skill: string; title: string; provider: string }[];
}

export function getSkillGap(targetRole: string) {
  return apiRequest<SkillGapResponse>(
    `/api/career/skill-gap?target_role=${encodeURIComponent(targetRole)}`
  );
}

/* =========================
   AUTH API
========================= */

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) return null;
    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
}

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<{ message: string }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

/* =========================
   CAREER OVERVIEW API
========================= */

export interface CareerMetric {
  label: string;
  score: number;
}

export interface CareerListItem {
  title: string;
  description: string;
  severity?: string | null;
}

export interface RoadmapItem {
  number: string;
  period: string;
  title: string;
  description: string;
}

export interface RecommendedRole {
  role: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
}

export interface CareerOverviewOut {
  score: number;
  headline: string;
  summary: string;
  profile_stage: string;
  metrics: CareerMetric[];
  strengths: CareerListItem[];
  limitations: CareerListItem[];
  roadmap: RoadmapItem[];
  recommended_roles: RecommendedRole[];
}

export function getCareerOverview() {
  return apiRequest<CareerOverviewOut>("/api/career/overview");
}

export interface SalaryEstimate {
  role: string;
  location: string;
  experience_years: number;
  low: number;
  mid: number;
  high: number;
  currency: string;
  disclaimer: string;
}

export function getSalaryEstimate() {
  return apiRequest<SalaryEstimate>("/api/career/salary-estimate");
}

/* =========================
   JOB RECOMMENDATIONS API
========================= */

import type { Job } from "@/types/job";

export function getJobRecommendations(location?: string, targetRole?: string) {
  const params = new URLSearchParams();
  if (location) params.set("location", location);
  if (targetRole) params.set("target_role", targetRole);

  const query = params.toString();
  return apiRequest<Job[]>(
    `/api/jobs/recommendations${query ? `?${query}` : ""}`
  );
}

export function createBlankResume() {
  return apiRequest<ResumeOut>("/api/resume/create", { method: "POST" });
}

/* =========================
   USER (ME) API
========================= */

export interface UserOut {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function getMe() {
  return apiRequest<UserOut>("/api/auth/me");
}

/* =========================
   ADMIN API
========================= */

export interface AdminStats {
  total_users: number;
  total_resumes: number;
  total_analyses: number;
  avg_ats_score: number | null;
  avg_match_score: number | null;
}

export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  resume_count: number;
}

export interface AdminAnalysisRow {
  id: number;
  user_email: string;
  job_title: string | null;
  match_score: number | null;
  missing_skills: string[] | null;
  created_at: string;
}

export interface AdminResumeRow {
  id: number;
  user_email: string;
  filename: string;
  ats_score: number | null;
  uploaded_at: string;
}

export function getAdminStats() {
  return apiRequest<AdminStats>("/api/admin/stats");
}

export function getAdminUsers(skip = 0, limit = 50) {
  return apiRequest<AdminUserRow[]>(`/api/admin/users?skip=${skip}&limit=${limit}`);
}

export function getAdminAnalyses(skip = 0, limit = 50) {
  return apiRequest<AdminAnalysisRow[]>(`/api/admin/analyses?skip=${skip}&limit=${limit}`);
}

export function getAdminResumes(skip = 0, limit = 50) {
  return apiRequest<AdminResumeRow[]>(`/api/admin/resumes?skip=${skip}&limit=${limit}`);
}