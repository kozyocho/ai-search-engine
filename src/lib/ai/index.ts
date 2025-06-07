// AI_SERVICES定数をエクスポート
export const AI_SERVICES = [
  { id: 'openai', name: 'ChatGPT', color: 'bg-green-500', isAvailable: true },
  { id: 'gemini', name: 'Gemini', color: 'bg-blue-500', isAvailable: true },
  { id: 'claude', name: 'Claude', color: 'bg-purple-500', isAvailable: false },
  { id: 'perplexity', name: 'Perplexity', color: 'bg-orange-500', isAvailable: false },
  { id: 'copilot', name: 'Copilot', color: 'bg-indigo-500', isAvailable: false }
]

// プロバイダーインターフェース
export interface AIProvider {
  id: string
  name: string
  search(query: string, apiKey: string): Promise<string>
}

// モックプロバイダー（開発用）
class MockAIProvider implements AIProvider {
  constructor(public id: string, public name: string) {}

  async search(query: string, apiKey: string): Promise<string> {
    // モック実装：1秒待機してダミーレスポンスを返す
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `${this.name}の回答: "${query}"についての回答をここに表示します。\n\nこれはモックデータです。実際の実装では、各AIサービスのAPIを呼び出して本物の回答を取得します。`
  }
}

// AI_PROVIDERS（実際のプロバイダーが実装されるまでモックを使用）
export const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: new MockAIProvider('openai', 'ChatGPT'),
  gemini: new MockAIProvider('gemini', 'Gemini'),
  claude: new MockAIProvider('claude', 'Claude'),
  perplexity: new MockAIProvider('perplexity', 'Perplexity'),
  copilot: new MockAIProvider('copilot', 'Copilot')
}