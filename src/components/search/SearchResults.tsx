"use client";

import { useState } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { AI_SERVICES } from "@/lib/ai";

export default function SearchResults() {
  const { results, summary, selectedAIs } = useSearchStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* AI回答一覧 */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">AI回答一覧</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {selectedAIs.map((aiId) => {
            const ai = AI_SERVICES.find((a) => a.id === aiId);
            const result = results[aiId];

            if (!ai) return null;

            return (
              <div
                key={aiId}
                className="min-w-[350px] bg-gray-800 rounded-lg p-6 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${ai.color}`}></div>
                    <h3 className="text-xl font-semibold text-white">
                      {ai.name}
                    </h3>
                  </div>

                  {result && !result.error && (
                    <button
                      onClick={() => handleCopy(result.content, aiId)}
                      className="p-2 hover:bg-gray-700 rounded transition-colors"
                    >
                      {copiedId === aiId ? (
                        <Check size={20} className="text-green-500" />
                      ) : (
                        <Copy size={20} className="text-gray-400" />
                      )}
                    </button>
                  )}
                </div>

                <div className="text-gray-300">
                  {result ? (
                    result.error ? (
                      <div className="text-red-400">
                        <p className="font-semibold">エラーが発生しました</p>
                        <p className="text-sm mt-2">{result.error}</p>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{result.content}</p>
                    )
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Loader2
                        className="animate-spin text-gray-500"
                        size={32}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 統合要約 */}
      {summary && (
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              ChatGPTによる統合要約
            </h2>
            <button
              onClick={() => handleCopy(summary, "summary")}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
            >
              {copiedId === "summary" ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <Copy size={20} className="text-white" />
              )}
            </button>
          </div>
          <div className="text-gray-100 whitespace-pre-wrap">{summary}</div>
        </div>
      )}
    </div>
  );
}
