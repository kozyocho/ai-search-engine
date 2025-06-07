#!/bin/bash

echo "AI統合検索エンジンのディレクトリ構造を作成します..."

# ディレクトリ構造を作成
directories=(
  "src/lib/supabase"
  "src/lib/ai"
  "src/lib/crypto"
  "src/lib/storage"
  "src/lib/utils"
  "src/components/common"
  "src/components/auth"
  "src/components/search"
  "src/components/results"
  "src/components/settings"
  "src/hooks"
  "src/types"
  "src/store"
  "src/styles/components"
  "src/styles/themes"
  "src/app/api/ai/search"
  "src/app/api/ai/summarize"
  "src/app/api/auth/callback"
  "src/app/login"
  "src/app/dashboard"
  "public/images"
  "tests/unit"
  "tests/integration"
  "tests/e2e"
  "docs"
  "scripts"
)

# ディレクトリを作成
for dir in "${directories[@]}"; do
  mkdir -p "$dir"
  echo "✓ ディレクトリ作成: $dir"
done

# 基本的なファイルを作成
files=(
  "src/lib/supabase/client.ts"
  "src/lib/supabase/server.ts"
  "src/lib/supabase/middleware.ts"
  "src/types/index.ts"
  "src/lib/crypto/encryption.ts"
  "src/lib/storage/secureStorage.ts"
  "src/lib/utils/constants.ts"
  "src/lib/utils/validators.ts"
  "src/lib/utils/formatters.ts"
  "src/store/authStore.ts"
  "src/store/searchStore.ts"
  "src/store/settingsStore.ts"
  "src/hooks/useAuth.ts"
  "src/hooks/useAISearch.ts"
  "src/hooks/useLocalStorage.ts"
  "src/hooks/useApiKeys.ts"
  ".env.example"
  "docs/API.md"
  "docs/SETUP.md"
  "docs/SECURITY.md"
)

# ファイルを作成
for file in "${files[@]}"; do
  touch "$file"
  echo "✓ ファイル作成: $file"
done

# .env.example の内容を作成
cat > .env.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Services (サーバーサイドのみ - オプション)
# OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_anthropic_key
EOF

echo ""
echo "========================================="
echo "✅ ディレクトリ構造の作成が完了しました！"
echo "========================================="
echo ""
echo "次のステップ:"
echo "1. cp .env.example .env.local"
echo "2. .env.local を編集してSupabaseの認証情報を設定"
echo "3. npm install で依存関係をインストール"
echo "4. npm run dev で開発サーバーを起動"
