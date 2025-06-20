import OpenAI from "openai";
import type { AIProvider } from "../types";

export class OpenAIProvider implements AIProvider {
  id = "openai";
  name = "ChatGPT";

  async search(query: string, apiKey: string): Promise<string> {
    if (!apiKey || apiKey === "mock-api-key") {
      throw new Error("OpenAI APIキーが設定されていません");
    }

    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // クライアントサイド実行のため
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "あなたは親切で知識豊富なアシスタントです。質問に対して正確で有用な情報を日本語で提供してください。",
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return (
        response.choices[0]?.message?.content ||
        "レスポンスが取得できませんでした"
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);
      if (error instanceof Error) {
        throw new Error(`OpenAI API エラー: ${error.message}`);
      }
      throw new Error("OpenAI API で予期しないエラーが発生しました");
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
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const responsesText = responses
        .map((r) => `**${r.aiName}の回答:**\n${r.content}`)
        .join("\n\n");

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `あなたは複数のAIの回答を要約する専門家です。以下のルールに従って要約を作成してください：

1. 各AIの回答の共通点と相違点を明確にする
2. 最も有用で正確な情報を抽出する
3. 矛盾する情報がある場合は明記する
4. 簡潔で読みやすい形式で要約する
5. 日本語で回答する`,
          },
          {
            role: "user",
            content: `以下の複数のAIからの回答を要約してください：\n\n${responsesText}`,
          },
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      return (
        response.choices[0]?.message?.content || "要約を生成できませんでした"
      );
    } catch (error) {
      console.error("OpenAI Summarization Error:", error);
      return "OpenAI API での要約生成中にエラーが発生しました";
    }
  }
}
