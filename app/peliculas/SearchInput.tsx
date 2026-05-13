"use client";

// CSR is the correct choice: the search input captures real-time user
// keystrokes and must debounce 300ms before triggering an API call.
// This is purely interactive — no SEO benefit from server-rendering
// a search field. useEffect manages the debounce lifecycle cleanly.

import { useState, useEffect, useRef, useCallback } from "react";

interface SearchInputProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [term, setTerm] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchRef = useRef(onSearch);

  // Keep callback ref in sync without re-triggering the debounce effect
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // 300ms debounce: only fire search after user stops typing for 300ms.
  // This avoids hammering the OMDb API on every keystroke.
  useEffect(() => {
    // Clear any pending timer from previous keystroke
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new debounce timer
    timerRef.current = setTimeout(() => {
      onSearchRef.current(term);
    }, 300);

    // Cleanup on unmount or when term changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [term]);

  const handleClear = useCallback(() => {
    setTerm("");
    onSearchRef.current("");
  }, []);

  return (
    <div className="relative max-w-md mx-auto w-full">
      {/* Search icon or loading spinner */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      {/* Input field */}
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Buscar película o serie..."
        className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur border border-white/10
                   rounded-xl text-white placeholder-gray-400
                   focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30
                   transition-colors"
        aria-label="Buscar película o serie"
      />

      {/* Clear button */}
      {term && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                     hover:text-white transition-colors focus:outline-none"
          aria-label="Limpiar búsqueda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
