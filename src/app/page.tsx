"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const supabase = createClient();

        // セッションを取得
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!mounted) return;

        if (session) {
          // ログイン済みの場合はダッシュボードへ
          router.push("/dashboard");
        } else {
          // 未ログインの場合はログインページへ
          router.push("/login");
        }
      } catch (err) {
        if (!mounted) return;

        console.error("認証チェックエラー:", err);
        setError("認証の確認中にエラーが発生しました");

        // エラーが発生した場合は3秒後にログインページへ
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // 認証状態の変更を監視
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard");
      } else if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    checkAuth();

    // クリーンアップ
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* ロゴまたはアプリ名 */}
        <h1 className="text-4xl font-bold text-white mb-8">
          AI統合検索エンジン
        </h1>

        {/* ローディング状態 */}
        {isLoading && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-gray-400">認証を確認しています...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 max-w-md">
            <p className="text-red-400">{error}</p>
            <p className="text-gray-400 text-sm mt-2">
              ログインページにリダイレクトします...
            </p>
          </div>
        )}

        {/* フッター情報 */}
        <div className="absolute bottom-8 left-0 right-0">
          <p className="text-gray-500 text-sm">
            複数のAIを統合した次世代検索エンジン
          </p>
        </div>
      </div>
    </div>
  );
}
