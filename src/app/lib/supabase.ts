import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example to .env and fill in your project URL and anon key."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types matching the DB schema ───────────────────────────────────────────

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "employee" | "mentor" | "admin";
  department: string;
  is_approved: boolean;
  xp: number;
  streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail_gradient: string;
  total_lessons: number;
  estimated_hours: number;
  xp_reward: number;
  skills: string[];
  is_published: boolean;
  created_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_percent: number;
  started_at: string;
  completed_at: string | null;
  last_accessed: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  starter_code_js: string;
  starter_code_ts: string;
  starter_code_py: string;
  test_cases: Array<{ id: number; input: string; expected: string }>;
  xp_reward: number;
  hints: string[];
  editorial: string | null;
  is_published: boolean;
  created_at: string;
}

export interface ChallengeSubmission {
  id: string;
  user_id: string;
  challenge_id: string;
  language: string;
  code: string;
  passed: boolean;
  test_results: unknown[];
  submitted_at: string;
  xp_earned: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  time_limit: number;
  xp_reward: number;
  pass_threshold: number;
  total_questions: number;
  is_published: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  type: "mcq" | "true_false" | "code_output";
  options: string[];
  correct_answer: string;
  explanation: string | null;
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  started_at: string;
  completed_at: string | null;
  xp_earned: number;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  skills: string[];
  required_challenge_count: number;
  required_quiz_pass_score: number;
  order_index: number;
  unlock_requirement: string | null;
  created_at: string;
}

export interface UserCertification {
  id: string;
  user_id: string;
  cert_id: string;
  issued_date: string;
  verification_id: string;
}

export interface XpTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  reference_id: string | null;
  description: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  item: string;
  type: string;
  xp_earned: number;
  created_at: string;
}
