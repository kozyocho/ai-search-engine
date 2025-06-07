import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";
// 他のプロバイダーも同様にインポート

export const AI_PROVIDERS = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
  // 他のプロバイダーを追加
};

export const AI_SERVICES = [
  { id: "openai", name: "ChatGPT", color: "bg-green-500", isAvailable: true },
  { id: "gemini", name: "Gemini", color: "bg-blue-500", isAvailable: true },
  { id: "claude", name: "Claude", color: "bg-purple-500", isAvailable: false },
  {
    id: "perplexity",
    name: "Perplexity",
    color: "bg-orange-500",
    isAvailable: false,
  },
  {
    id: "copilot",
    name: "Copilot",
    color: "bg-indigo-500",
    isAvailable: false,
  },
];
