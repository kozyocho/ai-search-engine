// AI関連の型定義
export interface AIService {
  id: string;
  name: string;
  color: string;
  isAvailable: boolean;
  description?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  search(query: string, apiKey: string): Promise<string>;
  summarize?(
    responses: Array<{ aiName: string; content: string }>,
    apiKey: string
  ): Promise<string>;
}

export interface AIResponse {
  aiId: string;
  content: string;
  timestamp: string;
  error?: string;
}

// 検索関連の型定義
export interface SearchQuery {
  query: string;
  selectedAIs: string[];
  timestamp: string;
}

export interface SearchResult {
  id: string;
  query: string;
  responses: AIResponse[];
  summary: string;
  createdAt: string;
}

// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
}

export interface ApiKey {
  aiId: string;
  encryptedKey: string;
}
