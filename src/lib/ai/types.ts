export interface AIProvider {
  id: string;
  name: string;
  search(query: string, apiKey: string): Promise<string>;
  summarize?(
    responses: Array<{ aiName: string; content: string }>,
    apiKey: string
  ): Promise<string>;
}

export interface AIService {
  id: string;
  name: string;
  color: string;
  isAvailable: boolean;
  description?: string;
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
