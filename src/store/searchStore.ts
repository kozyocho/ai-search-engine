import { create } from "zustand";
import { AI_PROVIDERS } from "@/lib/ai";
import { SecureStorage } from "@/lib/crypto/encryption";
import type { AIResponse, SearchResult } from "@/types";

interface SearchState {
  query: string;
  selectedAIs: string[];
  results: Record<string, AIResponse>;
  summary: string;
  isLoading: boolean;
  history: SearchResult[];
  apiKeys: Record<string, string>;

  setQuery: (query: string) => void;
  toggleAI: (aiId: string) => void;
  setApiKey: (aiId: string, key: string) => Promise<void>;
  loadApiKeys: () => Promise<void>;
  search: () => Promise<void>;
  loadHistory: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  selectedAIs: ["openai", "gemini", "claude"],
  results: {},
  summary: "",
  isLoading: false,
  history: [],
  apiKeys: {},

  setQuery: (query) => set({ query }),

  toggleAI: (aiId) => {
    const { selectedAIs } = get();
    const newSelectedAIs = selectedAIs.includes(aiId)
      ? selectedAIs.filter((id) => id !== aiId)
      : [...selectedAIs, aiId];
    set({ selectedAIs: newSelectedAIs });
  },

  setApiKey: async (aiId, key) => {
    try {
      const encryptedKey = await SecureStorage.encrypt(key, "user-password");
      if (typeof window !== "undefined") {
        localStorage.setItem(`apiKey_${aiId}`, encryptedKey);
      }
      set((state) => ({
        apiKeys: { ...state.apiKeys, [aiId]: key },
      }));
    } catch (error) {
      console.error("Failed to save API key:", error);
    }
  },

  loadApiKeys: async () => {
    try {
      if (typeof window === "undefined") return;

      const keys: Record<string, string> = {};
      for (const aiId in AI_PROVIDERS) {
        try {
          const encrypted = localStorage.getItem(`apiKey_${aiId}`);
          if (encrypted) {
            const decrypted = await SecureStorage.decrypt(
              encrypted,
              "user-password"
            );
            if (decrypted) keys[aiId] = decrypted;
          }
        } catch (error) {
          console.error(`Failed to load API key for ${aiId}:`, error);
        }
      }
      set({ apiKeys: keys });
    } catch (error) {
      console.error("Failed to load API keys:", error);
    }
  },

  search: async () => {
    const { query, selectedAIs, apiKeys } = get();
    if (!query || selectedAIs.length === 0) return;

    set({ isLoading: true, results: {}, summary: "" });

    try {
      const newResults: Record<string, AIResponse> = {};

      // 各AIに並列でリクエストを送信
      const promises = selectedAIs.map(async (aiId) => {
        const provider = AI_PROVIDERS[aiId];

        // APIキーのチェックを一時的にスキップ（モック実装のため）
        const apiKey = apiKeys[aiId] || "mock-api-key";

        if (!provider) {
          newResults[aiId] = {
            aiId,
            content: "プロバイダーが見つかりません",
            timestamp: new Date().toISOString(),
            error: "Provider not found",
          };
          return;
        }

        try {
          const content = await provider.search(query, apiKey);
          newResults[aiId] = {
            aiId,
            content,
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          newResults[aiId] = {
            aiId,
            content: "エラーが発生しました",
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }

        // 結果を逐次更新
        set((state) => ({
          results: { ...state.results, [aiId]: newResults[aiId] },
        }));
      });

      await Promise.all(promises);

      // 要約を生成（利用可能なAPIキーを持つプロバイダーを使用）
      try {
        const responses = Object.values(newResults)
          .filter((r) => !r.error)
          .map((r) => ({
            aiName: AI_PROVIDERS[r.aiId]?.name || r.aiId,
            content: r.content,
          }));

        if (responses.length > 0) {
          let summary = "";

          // OpenAI、Claude、Geminiの順で要約を試行
          const summarizeProviders = ["openai", "claude", "gemini"];

          for (const providerId of summarizeProviders) {
            const provider = AI_PROVIDERS[providerId];
            const apiKey = apiKeys[providerId];

            if (
              provider &&
              apiKey &&
              apiKey !== "mock-api-key" &&
              provider.summarize
            ) {
              try {
                summary = await provider.summarize(responses, apiKey);
                break; // 成功したらループを抜ける
              } catch (error) {
                console.error(
                  `Summary generation failed with ${providerId}:`,
                  error
                );
                continue; // 次のプロバイダーを試す
              }
            }
          }

          if (summary) {
            set({ summary });
          } else {
            set({
              summary:
                "要約を生成するには、OpenAI、Claude、またはGeminiのAPIキーが必要です。",
            });
          }
        }
      } catch (error) {
        console.error("Summary generation failed:", error);
        set({ summary: "要約の生成中にエラーが発生しました。" });
      }

      // 履歴に保存
      const newEntry: SearchResult = {
        id: Date.now().toString(),
        query,
        responses: Object.values(newResults),
        summary: get().summary,
        createdAt: new Date().toISOString(),
      };

      const updatedHistory = [newEntry, ...get().history].slice(0, 50);
      set({ history: updatedHistory });

      // ローカルストレージに保存
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        } catch (error) {
          console.error("Failed to save history:", error);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadHistory: async () => {
    try {
      if (typeof window === "undefined") return;

      const saved = localStorage.getItem("searchHistory");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          set({ history: parsed });
        }
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      set({ history: [] });
    }
  },
}));
