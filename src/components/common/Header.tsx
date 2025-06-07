"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Settings, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            AI統合検索エンジン
          </h1>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-300 text-sm">{user.email}</span>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSettings}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
              >
                <Settings size={20} />
                設定
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
              >
                <LogOut size={20} />
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
