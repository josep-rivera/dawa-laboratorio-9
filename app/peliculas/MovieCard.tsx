"use client";

// Client Component needed for onClick event handler (interactive card).
// The parent MovieGalleryClient passes the click handler — only the interactive
// wrapper needs 'use client'; this card could be a plain presentation component
// but since it receives and fires an onClick prop, we keep it client-safe.

import { MovieSearchResult } from "@/types/movie";

interface MovieCardProps {
  movie: MovieSearchResult;
  onClick: (imdbID: string) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div
      onClick={() => onClick(movie.imdbID)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(movie.imdbID);
        }
      }}
      aria-label={`Ver detalles de ${movie.Title}`}
      className="group cursor-pointer rounded-xl bg-white/10 backdrop-blur border border-white/10
                 overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105
                 transition-all duration-300 hover:border-yellow-400/50
                 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      {/* Poster */}
      {hasPoster ? (
        // eslint-disable-next-line @next/next/no-img-element -- External OMDb URLs, unoptimized
        <img
          src={movie.Poster}
          alt={`${movie.Title} poster`}
          className="w-full h-72 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-72 bg-gray-800 flex flex-col items-center justify-center gap-2">
          <span className="text-4xl opacity-50">🎬</span>
          <span className="text-gray-500 text-sm">Sin póster</span>
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-base leading-tight line-clamp-2 group-hover:text-yellow-300 transition-colors">
          {movie.Title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-gray-400 text-sm">{movie.Year}</span>
          <span className="text-gray-600">•</span>
          <span className="text-xs uppercase tracking-wider text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
            {movie.Type}
          </span>
        </div>
      </div>
    </div>
  );
}
