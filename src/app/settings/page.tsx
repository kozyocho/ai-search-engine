"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useSearchStore } from "@/store/searchStore";
import { AI_SERVICES } from "@/lib/ai";
import { ArrowLeft, Key, AlertCircle, Save, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { apiKeys, setApiKey } = useSearchStore();
  const [localApiKeys, setLocalApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    // 既存のAPIキーを読み込む
    setLocalApiKeys(apiKeys);
  }, [apiKeys]);

  const handleSaveKey = async (aiId: string) => {
    const key = localApiKeys[aiId];
    if (key) {
      await setApiKey(aiId, key);
      setSavedStates({ ...savedStates, [aiId]: true });
      setTimeout(() => {
        setSavedStates({ ...savedStates, [aiId]: false });
      }, 2000);
    }
  };

  const handleKeyChange = (aiId: string, value: string) => {
    setLocalApiKeys({ ...localApiKeys, [aiId]: value });
  };

  const toggleShowKey = (aiId: string) => {
    setShowKeys({ ...showKeys, [aiId]: !showKeys[aiId] });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              戻る
            </button>
            <h1 className="text-2xl font-bold">設定</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">APIキー設定</h2>

            <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-yellow-500 mt-1 flex-shrink-0"
                  size={20}
                />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-500 mb-1">
                    セキュリティに関する重要な注意事項
                  </p>
                  <p className="text-yellow-200">
                    APIキーはお客様のブラウザ内でのみ暗号化保存され、サーバーには一切送信されません。
                    各AIサービスの利用規約と料金体系をご確認の上、ご自身の責任でAPIキーを管理してください。
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {AI_SERVICES.map((ai) => (
                <div key={ai.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${ai.color}`}
                        ></div>
                        <h3 className="text-xl font-semibold">{ai.name}</h3>
                        {!ai.isAvailable && (
                          <span className="text-sm text-gray-500">
                            (準備中)
                          </span>
                        )}
                      </div>
                      {savedStates[ai.id] && (
                        <span className="text-green-500 text-sm">
                          保存しました
                        </span>
                      )}
                    </div>

                    {ai.isAvailable && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm text-gray-400">
                            APIキー
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <input
                                type={showKeys[ai.id] ? "text" : "password"}
                                placeholder={`${ai.name}のAPIキーを入力`}
                                value={localApiKeys[ai.id] || ""}
                                onChange={(e) =>
                                  handleKeyChange(ai.id, e.target.value)
                                }
                                className="w-full pr-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => toggleShowKey(ai.id)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              >
                                {showKeys[ai.id] ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => handleSaveKey(ai.id)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Save size={20} />
                              保存
                            </button>
                          </div>

                          {ai.id === "gemini" && (
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>取得方法:</p>
                              <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>
                                  <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                  >
                                    Google AI Studio
                                  </a>
                                  にアクセス
                                </li>
                                <li>「Get API key」をクリック</li>
                                <li>「Create API key」で新しいキーを生成</li>
                                <li>生成されたキーをコピーして貼り付け</li>
                              </ol>
                            </div>
                          )}

                          {ai.id === "openai" && (
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>取得方法:</p>
                              <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>
                                  <a
                                    href="https://platform.openai.com/api-keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                  >
                                    OpenAI Platform
                                  </a>
                                  にアクセス
                                </li>
                                <li>「Create new secret key」をクリック</li>
                                <li>キーに名前を付けて「Create secret key」</li>
                                <li>
                                  表示されたキーをコピー（一度しか表示されません）
                                </li>
                              </ol>
                            </div>
                          )}

                          {ai.id === "claude" && (
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>取得方法:</p>
                              <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>
                                  <a
                                    href="https://console.anthropic.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                  >
                                    Anthropic Console
                                  </a>
                                  にアクセス
                                </li>
                                <li>「API Keys」セクションに移動</li>
                                <li>「Create Key」をクリック</li>
                                <li>生成されたキーをコピーして貼り付け</li>
                              </ol>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">その他の設定</h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">
                追加の設定項目は今後実装予定です。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
