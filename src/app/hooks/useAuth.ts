import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isAllowedEmail } from "../lib/supabase";
import { notifyAdminNewRegistration, sendPendingApprovalEmail } from "../lib/emailService";

export type UserRole = "employee" | "mentor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  isApproved: boolean;
  xp: number;
  streak: number;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; fullName: string; department: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        if (!isAllowedEmail(email)) {
          throw new Error("Only @redihire.com email addresses are allowed.");
        }

        // Step 1: Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          if (authError.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password.");
          }
          if (authError.message.includes("Email not confirmed")) {
            throw new Error("Email not confirmed. Please check your inbox.");
          }
          throw new Error(authError.message);
        }

        if (!authData?.user) throw new Error("Login failed.");

        const userId = authData.user.id;

        // Step 2: Fetch profile directly by id
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, department, role, is_approved, xp, streak")
          .eq("id", userId)
          .maybeSingle();

        // Step 3: If profile missing, create it now
        if (!profile) {
          const newProfile = {
            id: userId,
            email: authData.user.email!,
            full_name: authData.user.user_metadata?.full_name || email.split("@")[0],
            department: authData.user.user_metadata?.department || "Engineering",
            role: "employee" as UserRole,
            is_approved: false,
            xp: 0,
            streak: 0,
          };

          await supabase.from("profiles").upsert(newProfile, { onConflict: "id" });

          set({ user: { ...newProfile, name: newProfile.full_name }, isAuthenticated: false });
          throw new Error("PENDING_APPROVAL");
        }

        if (profileError) {
          throw new Error("Could not load your profile. Please try again.");
        }

        const user: User = {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          role: profile.role as UserRole,
          department: profile.department || "Engineering",
          isApproved: profile.is_approved,
          xp: profile.xp || 0,
          streak: profile.streak || 0,
        };

        set({ user, isAuthenticated: profile.is_approved });

        if (!profile.is_approved) {
          throw new Error("PENDING_APPROVAL");
        }
      },

      signup: async ({ email, password, fullName, department }) => {
        if (!isAllowedEmail(email)) {
          throw new Error("Only @redihire.com email addresses are allowed.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, department, role: "employee" },
          },
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Signup failed.");

        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          department,
          role: "employee",
          is_approved: false,
          xp: 0,
          streak: 0,
        }, { onConflict: "id" });

        // Send both emails — fire-and-forget, must not block signup
        Promise.all([
          sendPendingApprovalEmail({ name: fullName, email, department }),
          notifyAdminNewRegistration({ name: fullName, email, department }),
        ]).catch((err) => console.error("[email] Notification failed:", err));

        set({
          user: {
            id: data.user.id,
            name: fullName,
            email,
            role: "employee",
            department,
            isApproved: false,
            xp: 0,
            streak: 0,
          },
          isAuthenticated: false,
        });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (data) {
          set({
            user: {
              id: data.id,
              name: data.full_name,
              email: data.email,
              role: data.role as UserRole,
              department: data.department,
              isApproved: data.is_approved,
              xp: data.xp,
              streak: data.streak,
            },
            isAuthenticated: data.is_approved,
          });
        }
      },
    }),
    { name: "rlearn-auth-v2" }
  )
);
