import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "../types";

export class ClaudeProvider implements AIProvider {
  id = "claude";
  name = "Claude";

  async search(query: string, apiKey: string): Promise<string> {
    if (!apiKey || apiKey === "mock-api-key") {
      throw new Error("Claude APIキーが設定されていません");
    }

    try {
      const anthropic = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true, // クライアントサイド実行のため
      });

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 0.7,
        system:
          "あなたは親切で知識豊富なアシスタントです。質問に対して正確で有用な情報を日本語で提供してください。",
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
      });

      const textContent = response.content.find(
        (content) => content.type === "text"
      );
      return textContent?.text || "レスポンスが取得できませんでした";
    } catch (error) {
      console.error("Claude API Error:", error);
      if (error instanceof Error) {
        throw new Error(`Claude API エラー: ${error.message}`);
      }
      throw new Error("Claude API で予期しないエラーが発生しました");
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
      const anthropic = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const responsesText = responses
        .map((r) => `**${r.aiName}の回答:**\n${r.content}`)
        .join("\n\n---\n\n");

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 800,
        temperature: 0.3,
        system: `あなたは複数のAIの回答を要約する専門家です。以下のルールに従って要約を作成してください：

1. 各AIの回答の共通点と相違点を明確にする
2. 最も有用で正確な情報を抽出する
3. 矛盾する情報がある場合は明記する
4. 簡潔で読みやすい形式で要約する
5. 日本語で回答する`,
        messages: [
          {
            role: "user",
            content: `以下の複数のAIからの回答を要約してください：\n\n${responsesText}`,
          },
        ],
      });

      const textContent = response.content.find(
        (content) => content.type === "text"
      );
      return textContent?.text || "要約を生成できませんでした";
    } catch (error) {
      console.error("Claude Summarization Error:", error);
      return "Claude API での要約生成中にエラーが発生しました";
    }
  }
}
