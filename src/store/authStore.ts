// import { create } from "zustand";
// import { createClient } from "@/lib/supabase/client";
// import type { User } from "@/types";

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   checkSession: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   loading: true,

//   signIn: async (email: string, password: string) => {
//     const supabase = createClient();
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) throw error;
//     if (data.user) {
//       set({ user: { id: data.user.id, email: data.user.email! } });
//     }
//   },

//   signUp: async (email: string, password: string) => {
//     const supabase = createClient();
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     if (error) throw error;
//     if (data.user) {
//       set({ user: { id: data.user.id, email: data.user.email! } });
//     }
//   },

//   signOut: async () => {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     set({ user: null });
//   },

//   checkSession: async () => {
//     set({ loading: true });
//     const supabase = createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (user) {
//       set({ user: { id: user.id, email: user.email! }, loading: false });
//     } else {
//       set({ user: null, loading: false });
//     }
//   },
// }));

import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// 開発用のモックユーザー
const MOCK_USER = {
  id: "mock-user-123",
  email: "test@example.com",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    // 開発用：任意のメールアドレスとパスワードでログイン可能
    console.log("Mock sign in:", { email, password });

    // 簡単なバリデーション
    if (!email || !password) {
      throw new Error("メールアドレスとパスワードを入力してください");
    }

    // 実際のSupabase実装の場合はここをアンコメント
    /*
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    if (data.user) {
      set({ user: { id: data.user.id, email: data.user.email! } })
    }
    */

    // モック実装：1秒待機してログイン成功
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ user: { ...MOCK_USER, email } });
  },

  signUp: async (email: string, password: string) => {
    // 開発用：任意のメールアドレスとパスワードで登録可能
    console.log("Mock sign up:", { email, password });

    if (!email || !password) {
      throw new Error("メールアドレスとパスワードを入力してください");
    }

    if (password.length < 6) {
      throw new Error("パスワードは6文字以上で入力してください");
    }

    // モック実装：1秒待機して登録成功
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ user: { ...MOCK_USER, email } });
  },

  signOut: async () => {
    console.log("Mock sign out");

    // 実際のSupabase実装の場合
    /*
    const supabase = createClient()
    await supabase.auth.signOut()
    */

    set({ user: null });
  },

  checkSession: async () => {
    console.log("Mock check session");
    set({ loading: true });

    // 実際のSupabase実装の場合
    /*
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      set({ user: { id: user.id, email: user.email! }, loading: false })
    } else {
      set({ user: null, loading: false })
    }
    */

    // モック実装：セッションなし
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ user: null, loading: false });
  },
}));
