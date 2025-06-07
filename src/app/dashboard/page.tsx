"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    checkSession().then(() => {
      if (!user) router.push("/login");
    });
  }, [checkSession, user, router]);

  useEffect(() => {
    if (user) {
      loadApiKeys();
      loadHistory();
    }
  }, [user, loadApiKeys, loadHistory]);

  if (!user) return null;

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
