"use client";

// Client Component — bridges SSR initial data with CSR interactive state.
// SSR provides the initial movie list (embedded in HTML, SEO-friendly).
// CSR handles search (no page reload) and modal (user-triggered interaction).
// useState manages search results and selected movie; useCallback memoizes
// the search handler passed to the debounced SearchInput.

import { useState, useCallback } from "react";
import type { MovieSearchResult, MovieDetail } from "@/types/movie";
import { searchMovies, getMovieDetail } from "@/lib/api/omdb";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import SearchInput from "./SearchInput";

interface MovieGalleryClientProps {
  initialMovies: MovieSearchResult[];
}

export default function MovieGalleryClient({
  initialMovies,
}: MovieGalleryClientProps) {
  const [searchResults, setSearchResults] = useState<MovieSearchResult[] | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // When searchResults is null, the user hasn't searched — show SSR results.
  // When searchResults is an array (even empty), show CSR results.
  const displayMovies = searchResults ?? initialMovies;
  const isSearchActive = searchResults !== null;

  // Handle search — fired by SearchInput after 300ms debounce
  const handleSearch = useCallback(async (term: string) => {
    // Empty search resets to SSR initial list
    if (!term.trim()) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await searchMovies(term);
      if (response.Response === "True") {
        setSearchResults(response.Search);
      } else {
        setSearchResults([]);
        setSearchError(response.Error || "No se encontraron resultados");
      }
    } catch {
      setSearchError("Error al buscar películas. Verifica tu conexión.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle movie card click — fetch detail and open modal
  const handleMovieClick = useCallback(async (imdbID: string) => {
    setIsLoadingDetail(true);
    setIsModalOpen(true);

    try {
      const detail = await getMovieDetail(imdbID);
      if (detail.Response === "True") {
        setSelectedMovie(detail);
      } else {
        setSelectedMovie(null);
      }
    } catch {
      setSelectedMovie(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }, []);

  return (
    <>
      {/* Search bar */}
      <div className="mb-8">
        <SearchInput onSearch={handleSearch} isLoading={isSearching} />
      </div>

      {/* Contextual label */}
      <div className="mb-4 text-sm font-medium">
        {isSearchActive ? (
          <span className="text-blue-400">
            🔄 Resultados de búsqueda (CSR — sin recargar página)
          </span>
        ) : (
          <span className="text-green-400">
            🖥️ Películas populares (SSR — datos en HTML inicial)
          </span>
        )}
      </div>

      {/* Loading state */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent" />
          <p className="text-gray-400 text-lg">Buscando películas...</p>
        </div>
      )}

      {/* Error state */}
      {!isSearching && isSearchActive && searchError && (
        <div className="text-center py-16">
          <p className="text-red-400 text-lg mb-2">⚠️ {searchError}</p>
          <p className="text-gray-500 text-sm">
            Intenta con otro término de búsqueda.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isSearching && isSearchActive && !searchError && displayMovies.length === 0 && (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">📭</span>
          <p className="text-gray-400 text-lg">
            No se encontraron películas para tu búsqueda.
          </p>
        </div>
      )}

      {/* Movie grid */}
      {!isSearching && displayMovies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onClick={handleMovieClick}
            />
          ))}
        </div>
      )}

      {/* Detail modal loading */}
      {isLoadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent" />
        </div>
      )}

      {/* Detail modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen && !isLoadingDetail}
        onClose={handleCloseModal}
      />
    </>
  );
}
