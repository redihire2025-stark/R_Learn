import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, Profile } from "../lib/supabase";
import { updateStreak } from "../lib/xp";

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
  longestStreak: number;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  pendingEmail: string | null;
  pendingMeta: { name?: string; department?: string } | null;

  sendOTP: (email: string, meta?: { name?: string; department?: string }) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<{ needsApproval: boolean }>;
  signInWithPassword: (email: string, password: string) => Promise<void>;

  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const ADMIN_EMAIL = "itsupport@redihire.com";

function profileToUser(p: Profile): User {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role as UserRole,
    department: p.department,
    isApproved: p.is_approved,
    xp: p.xp,
    streak: p.streak,
    longestStreak: p.longest_streak,
    avatar: p.avatar_url ?? undefined,
  };
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      pendingEmail: null,
      pendingMeta: null,

      sendOTP: async (email, meta) => {
        if (email.toLowerCase() === ADMIN_EMAIL) {
          throw new Error("Admin account uses password login. Please use the password field below.");
        }

        const { error } = await supabase.auth.signInWithOtp({
          email: email.toLowerCase(),
          options: {
            shouldCreateUser: true,
            data: {
              name: meta?.name ?? null,
              department: meta?.department ?? "Engineering",
            },
          },
        });
        if (error) throw new Error(error.message);

        set({ pendingEmail: email.toLowerCase(), pendingMeta: meta ?? null });
      },

      verifyOTP: async (email, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
          email: email.toLowerCase(),
          token,
          type: "email",
        });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Verification failed. Please try again.");

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!profile) throw new Error("Profile not found. Please contact admin.");

        const user = profileToUser(profile);
        set({ user, isAuthenticated: profile.is_approved, pendingEmail: null, pendingMeta: null });

        if (profile.is_approved) {
          updateStreak().catch(() => {});
          setTimeout(() => get().refreshUser(), 800);
        }

        return { needsApproval: !profile.is_approved };
      },

      signInWithPassword: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Sign in failed.");

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!profile) throw new Error("Profile not found.");
        if (!profile.is_approved) throw new Error("Account not approved. Contact admin.");

        const user = profileToUser(profile);
        set({ user, isAuthenticated: true });

        updateStreak().catch(() => {});
        setTimeout(() => get().refreshUser(), 800);
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, pendingEmail: null, pendingMeta: null });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      refreshUser: async () => {
        const { user } = get();
        if (!user) return;
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (p) {
          set({ user: profileToUser(p), isAuthenticated: p.is_approved });
        }
      },
    }),
    {
      name: "rlearn-auth",
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
        pendingEmail: s.pendingEmail,
      }),
    }
  )
);
