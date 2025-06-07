import OpenAI from "openai";
import { BaseAIProvider } from "./base";

export class OpenAIProvider extends BaseAIProvider {
  constructor() {
    super("openai", "ChatGPT");
  }

  async search(query: string, apiKey: string): Promise<string> {
    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // クライアントサイドでの使用
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get response from ChatGPT");
    }
  }

  async summarize(
    responses: { aiName: string; content: string }[],
    apiKey: string
  ): Promise<string> {
    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `以下の各AIからの回答を分析し、統合的な要約を作成してください。同じような回答はまとめ、異なる意見はそれぞれ明記してください。

${responses.map((r) => `【${r.aiName}の回答】\n${r.content}`).join("\n\n")}

統合要約：`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || "No summary generated";
    } catch (error) {
      console.error("OpenAI summarize error:", error);
      throw new Error("Failed to generate summary");
    }
  }
}
