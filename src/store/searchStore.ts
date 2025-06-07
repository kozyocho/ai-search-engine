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
  selectedAIs: ["openai", "gemini"],
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
    const encryptedKey = await SecureStorage.encrypt(key, "user-password");
    localStorage.setItem(`apiKey_${aiId}`, encryptedKey);
    set((state) => ({
      apiKeys: { ...state.apiKeys, [aiId]: key },
    }));
  },

  loadApiKeys: async () => {
    const keys: Record<string, string> = {};
    for (const aiId in AI_PROVIDERS) {
      const encrypted = localStorage.getItem(`apiKey_${aiId}`);
      if (encrypted) {
        const decrypted = await SecureStorage.decrypt(
          encrypted,
          "user-password"
        );
        if (decrypted) keys[aiId] = decrypted;
      }
    }
    set({ apiKeys: keys });
  },

  search: async () => {
    const { query, selectedAIs, apiKeys } = get();
    if (!query || selectedAIs.length === 0) return;

    set({ isLoading: true, results: {}, summary: "" });

    const newResults: Record<string, AIResponse> = {};

    // 各AIに並列でリクエストを送信
    const promises = selectedAIs.map(async (aiId) => {
      const provider = AI_PROVIDERS[aiId];
      const apiKey = apiKeys[aiId];

      if (!provider || !apiKey) {
        newResults[aiId] = {
          aiId,
          content: "APIキーが設定されていません",
          timestamp: new Date().toISOString(),
          error: "Missing API key",
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
    });

    await Promise.all(promises);
    set({ results: newResults });

    // ChatGPTで要約を生成
    if (apiKeys.openai) {
      try {
        const openai = AI_PROVIDERS.openai as any;
        const responses = Object.values(newResults)
          .filter((r) => !r.error)
          .map((r) => ({
            aiName: AI_PROVIDERS[r.aiId]?.name || r.aiId,
            content: r.content,
          }));

        const summary = await openai.summarize(responses, apiKeys.openai);
        set({ summary });
      } catch (error) {
        console.error("Summary generation failed:", error);
      }
    }

    set({ isLoading: false });

    // 履歴に保存
    const { history } = get();
    const newEntry: SearchResult = {
      id: Date.now().toString(),
      query,
      responses: Object.values(newResults),
      summary: get().summary,
      createdAt: new Date().toISOString(),
    };
    set({ history: [newEntry, ...history].slice(0, 50) });

    // ローカルストレージに保存
    localStorage.setItem("searchHistory", JSON.stringify(get().history));
  },

  loadHistory: async () => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      set({ history: JSON.parse(saved) });
    }
  },
}));
