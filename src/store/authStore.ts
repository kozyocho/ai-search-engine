import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("メールアドレスとパスワードを入力してください");
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
      };
      set({ user });
    }
  },

  signUp: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("メールアドレスとパスワードを入力してください");
    }

    if (password.length < 6) {
      throw new Error("パスワードは6文字以上で入力してください");
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
      };
      set({ user });
    }
  },

  signOut: async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    set({ user: null });
  },

  checkSession: async () => {
    set({ loading: true });

    const supabase = createClient();

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session check error:", error);
        set({ user: null, loading: false });
        return;
      }

      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || "",
        };
        set({ user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("Session check failed:", error);
      set({ user: null, loading: false });
    }
  },
}));
