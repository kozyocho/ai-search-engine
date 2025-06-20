# MCP（Model Context Protocol）を使用した Supabase 設定

このドキュメントでは、AI 統合検索エンジンで MCP を使用して Supabase との連携を設定する方法を説明します。

## MCP とは

Model Context Protocol（MCP）は、Claude Desktop などの AI アシスタントが外部ツールやサービスと安全に通信するためのプロトコルです。このプロジェクトでは、MCP を使用して Supabase との操作を管理します。

## 必要な設定

### 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com) にアクセス
2. 新しいプロジェクトを作成
3. Project URL と Anon key を取得

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. データベーススキーマの設定

Supabase のダッシュボードで、`mcp-servers/supabase-schema.sql` の内容を実行：

```sql
-- AI統合検索エンジン用のSupabaseスキーマ
-- （ファイルの内容をコピーして実行）
```

### 4. MCP サーバーの起動

```bash
# MCPサーバーの依存関係をインストール
cd mcp-servers
npm install

# MCPサーバーを起動
npm start
```

### 5. Claude Desktop 設定（オプション）

Claude Desktop を使用する場合、設定ファイルを更新：

```json
{
  "mcpServers": {
    "ai-search-engine-supabase": {
      "command": "node",
      "args": ["./mcp-servers/supabase-server.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## MCP サーバーで利用可能な機能

### ツール

1. **supabase_init**: Supabase クライアントの初期化
2. **create_user_profile**: ユーザープロファイルの作成
3. **save_search_history**: 検索履歴の保存
4. **get_user_settings**: ユーザー設定の取得
5. **update_user_settings**: ユーザー設定の更新

### リソース

1. **supabase://users**: ユーザー情報の管理
2. **supabase://search_history**: 検索履歴の管理
3. **supabase://api_keys**: API キーの暗号化保存

## プログラムでの MCP 使用例

```typescript
import { getSupabaseClient } from "@/lib/supabase/mcp-client";

// クライアントの取得（環境に応じて自動選択）
const client = getSupabaseClient();

// ユーザープロファイルの作成
await client.createUserProfile("user-id", "user@example.com", {
  preferences: { theme: "dark" },
});

// 検索履歴の保存
await client.saveSearchHistory(
  "user-id",
  "TypeScriptについて教えて",
  [
    { aiId: "openai", content: "OpenAIの回答...", timestamp: "..." },
    { aiId: "gemini", content: "Geminiの回答...", timestamp: "..." },
  ],
  "TypeScriptに関する統合要約"
);

// ユーザー設定の取得
const settings = await client.getUserSettings("user-id");

// ユーザー設定の更新
await client.updateUserSettings("user-id", {
  defaultAIs: ["openai", "gemini"],
  autoSave: true,
});
```

## セキュリティ

- Row Level Security (RLS) が有効化されており、ユーザーは自分のデータのみアクセス可能
- API キーは暗号化されてデータベースに保存
- MCP サーバーはローカル環境でのみ動作

## トラブルシューティング

### MCP サーバーが起動しない場合

1. Node.js のバージョンを確認（18.0.0 以上が必要）
2. 依存関係が正しくインストールされているか確認
3. 環境変数が正しく設定されているか確認

### Supabase 接続エラー

1. Project URL と Anon key が正しいか確認
2. Supabase プロジェクトで RLS ポリシーが正しく設定されているか確認
3. データベースのスキーマが正しく作成されているか確認

### デバッグ

MCP サーバーのログを確認：

```bash
cd mcp-servers
npm run dev  # ウォッチモードで起動
```

## 参考資料

- [Supabase Documentation](https://supabase.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/desktop-mcp)
