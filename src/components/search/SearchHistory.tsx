"use client";

import { ChevronRight } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import type { SearchResult } from "@/types";

export default function SearchHistory() {
  const { history, setQuery } = useSearchStore();

  if (history.length === 0) {
    return null;
  }

  const handleHistoryClick = (item: SearchResult) => {
    setQuery(item.query);
    // 必要に応じて検索も実行
    // search()
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-4 text-white">検索履歴</h3>
      <div className="space-y-2 max-w-2xl mx-auto">
        {history.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => handleHistoryClick(item)}
            className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-between group"
          >
            <span className="truncate text-gray-300">{item.query}</span>
            <ChevronRight
              className="text-gray-500 group-hover:text-white transition-colors"
              size={20}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
