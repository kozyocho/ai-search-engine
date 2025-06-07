import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseAIProvider } from "./base";

export class GeminiProvider extends BaseAIProvider {
  constructor() {
    super("gemini", "Gemini");
  }

  async search(query: string, apiKey: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(query);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to get response from Gemini");
    }
  }
}
