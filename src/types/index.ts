export interface AIService {
  id: string;
  name: string;
  color: string;
  isAvailable: boolean;
}

export interface AIResponse {
  aiId: string;
  content: string;
  timestamp: string;
  error?: string;
}

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

export interface User {
  id: string;
  email: string;
}

export interface ApiKey {
  aiId: string;
  encryptedKey: string;
}
