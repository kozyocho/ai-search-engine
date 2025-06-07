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

// セッション情報を保存するキー
const SESSION_KEY = "mock_auth_session";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    // 開発用：任意のメールアドレスとパスワードでログイン可能
    console.log("Mock sign in:", { email, password });

    // 簡単なバリデーション
    if (!email || !password) {
      throw new Error("メールアドレスとパスワードを入力してください");
    }

    // モック実装：1秒待機してログイン成功
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = { ...MOCK_USER, email };

    // セッション情報を保存（開発用）
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }

    set({ user });
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

    const user = { ...MOCK_USER, email };

    // セッション情報を保存（開発用）
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }

    set({ user });
  },

  signOut: async () => {
    console.log("Mock sign out");

    // セッション情報を削除
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }

    set({ user: null });
  },

  checkSession: async () => {
    console.log("Mock check session");
    set({ loading: true });

    // モック実装：保存されたセッション情報を確認
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (typeof window !== "undefined") {
      try {
        const savedSession = localStorage.getItem(SESSION_KEY);
        if (savedSession) {
          const user = JSON.parse(savedSession);
          console.log("Session found:", user);
          set({ user, loading: false });
          return;
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      }
    }

    console.log("No session found");
    set({ user: null, loading: false });
  },
}));
