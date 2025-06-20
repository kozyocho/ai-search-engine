import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider } from "../types";

export class GeminiProvider implements AIProvider {
  id = "gemini";
  name = "Gemini";

  async search(query: string, apiKey: string): Promise<string> {
    if (!apiKey || apiKey === "mock-api-key") {
      throw new Error("Gemini APIキーが設定されていません");
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `質問: ${query}

以下のガイドラインに従って回答してください：
- 正確で有用な情報を提供する
- 日本語で回答する
- 簡潔で分かりやすく説明する
- 不確実な情報がある場合は明記する`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || "レスポンスが取得できませんでした";
    } catch (error) {
      console.error("Gemini API Error:", error);
      if (error instanceof Error) {
        throw new Error(`Gemini API エラー: ${error.message}`);
      }
      throw new Error("Gemini API で予期しないエラーが発生しました");
    }
  }

  async summarize(
    responses: Array<{ aiName: string; content: string }>,
    apiKey: string
  ): Promise<string> {
    if (!apiKey || apiKey === "mock-api-key") {
      return "APIキーが設定されていないため、要約を生成できません";
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const responsesText = responses
        .map((r) => `**${r.aiName}の回答:**\n${r.content}`)
        .join("\n\n---\n\n");

      const prompt = `以下は複数のAIからの回答です。これらを要約してください：

${responsesText}

要約のガイドライン：
1. 各AIの回答の共通点と相違点を明確にする
2. 最も重要で有用な情報を抽出する
3. 矛盾する情報があれば指摘する
4. 読みやすく整理された形式で要約する
5. 日本語で回答する
6. 簡潔にまとめる（500文字程度）`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || "要約を生成できませんでした";
    } catch (error) {
      console.error("Gemini Summarization Error:", error);
      return "Gemini API での要約生成中にエラーが発生しました";
    }
  }
}
