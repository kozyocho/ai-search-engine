"use client";

import { useSearchStore } from "@/store/searchStore";
import { AI_SERVICES } from "@/lib/ai";

export default function AISelector() {
  const { selectedAIs, toggleAI } = useSearchStore();

  return (
    <div className="flex flex-wrap gap-2">
      {AI_SERVICES.map((ai) => (
        <button
          key={ai.id}
          onClick={() => toggleAI(ai.id)}
          disabled={!ai.isAvailable}
          className={`px-4 py-2 rounded-full transition-all ${
            selectedAIs.includes(ai.id)
              ? `${ai.color} text-white`
              : ai.isAvailable
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {ai.name}
          {!ai.isAvailable && " (準備中)"}
        </button>
      ))}
    </div>
  );
}
