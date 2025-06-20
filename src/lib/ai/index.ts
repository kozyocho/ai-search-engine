import { OpenAIProvider } from "./providers/openai";
import { GeminiProvider } from "./providers/gemini";
import { ClaudeProvider } from "./providers/claude";
import type { AIService, AIProvider } from "./types";

// AI_SERVICES定数をエクスポート
export const AI_SERVICES: AIService[] = [
  {
    id: "openai",
    name: "ChatGPT",
    color: "bg-green-500",
    isAvailable: true,
    description: "OpenAIの高性能チャットボット",
  },
  {
    id: "gemini",
    name: "Gemini",
    color: "bg-blue-500",
    isAvailable: true,
    description: "Googleの最新AI",
  },
  {
    id: "claude",
    name: "Claude",
    color: "bg-purple-500",
    isAvailable: true,
    description: "Anthropicの親切なAI",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    color: "bg-orange-500",
    isAvailable: false,
    description: "準備中",
  },
  {
    id: "copilot",
    name: "Copilot",
    color: "bg-indigo-500",
    isAvailable: false,
    description: "準備中",
  },
];

// モックプロバイダー（開発用）
class MockAIProvider implements AIProvider {
  constructor(public id: string, public name: string) {}

  async search(query: string, apiKey: string): Promise<string> {
    // モック実装：1秒待機してダミーレスポンスを返す
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `${this.name}の回答: "${query}"についての回答をここに表示します。\n\nこれはモックデータです。実際の実装では、各AIサービスのAPIを呼び出して本物の回答を取得します。`;
  }
}

// AI_PROVIDERS（実際のプロバイダー実装）
export const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
  claude: new ClaudeProvider(),
  perplexity: new MockAIProvider("perplexity", "Perplexity"),
  copilot: new MockAIProvider("copilot", "Copilot"),
};
