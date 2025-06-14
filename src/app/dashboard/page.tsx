"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useSearchStore } from "@/store/searchStore";
import Header from "@/components/common/Header";
import SearchBar from "@/components/search/SearchBar";
import AISelector from "@/components/search/AISelector";
import SearchResults from "@/components/search/SearchResults";
import SearchHistory from "@/components/search/SearchHistory";

export default function DashboardPage() {
  const router = useRouter();
  const { user, checkSession } = useAuthStore();
  const { results, loadApiKeys, loadHistory } = useSearchStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // 初回マウント時のみセッションチェック
  useEffect(() => {
    const initializeAuth = async () => {
      await checkSession();
      setIsInitialized(true);
    };

    initializeAuth();
  }, []); // 空の依存配列で初回のみ実行

  // ユーザー状態の監視とリダイレクト
  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    }
  }, [isInitialized, user, router]);

  // ユーザーがログインしたらデータを読み込む
  useEffect(() => {
    if (user && isInitialized) {
      // 関数を直接呼び出す
      loadApiKeys();
      loadHistory();
    }
  }, [user, isInitialized]); // 関数は依存配列に含めない

  // 初期化中のローディング表示
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  // ユーザーがいない場合
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <SearchBar />
          <AISelector />

          {Object.keys(results).length > 0 ? (
            <SearchResults />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold mb-4">
                複数のAIに一度に質問しよう
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                質問を入力して、選択したAIから最適な回答を見つけましょう
              </p>
              <SearchHistory />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
