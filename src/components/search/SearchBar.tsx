"use client";

import { Search, Loader2 } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

export default function SearchBar() {
  const { query, setQuery, search, isLoading, selectedAIs } = useSearchStore();

  const handleSearch = async () => {
    if (!query.trim() || selectedAIs.length === 0) return;
    await search();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="質問を入力してください..."
          className="w-full px-6 py-4 pr-12 bg-gray-700 border border-gray-600 rounded-full text-lg text-white focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <Search
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={24}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={!query.trim() || selectedAIs.length === 0 || isLoading}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full font-semibold transition-colors text-white flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            検索中...
          </>
        ) : (
          <>
            <Search size={20} />
            検索
          </>
        )}
      </button>
    </div>
  );
}
