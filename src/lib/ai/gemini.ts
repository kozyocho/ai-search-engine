import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseAIProvider } from "./base";

export class GeminiProvider extends BaseAIProvider {
  constructor() {
    super("gemini", "Gemini");
  }

  async search(query: string, apiKey: string): Promise<string> {
    try {
      console.log("Gemini search called with query:", query);

      if (!apiKey || apiKey === "mock-api-key") {
        throw new Error("有効なAPIキーが必要です");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(query);
      const response = await result.response;
      const text = response.text();

      console.log("Gemini response received:", text);
      return text;
    } catch (error: any) {
      console.error("Gemini API error:", error);

      // エラーメッセージをより詳細に
      if (error.message?.includes("API_KEY_INVALID")) {
        throw new Error("APIキーが無効です。正しいAPIキーを設定してください。");
      } else if (error.message?.includes("PERMISSION_DENIED")) {
        throw new Error("APIキーの権限が不足しています。");
      } else if (error.message?.includes("QUOTA_EXCEEDED")) {
        throw new Error("API利用制限に達しました。");
      }

      throw new Error(
        `Geminiからの応答取得に失敗しました: ${error.message || "不明なエラー"}`
      );
    }
  }
}
