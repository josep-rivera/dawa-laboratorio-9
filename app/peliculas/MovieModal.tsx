"use client";

// Client Component — modal visibility and interaction depend entirely on
// user-triggered state (open/close). CSR is the correct choice: the modal
// has no SEO value, and its rendering is conditional on a click event.
// SSR would waste server cycles rendering something the user may never see.

import { useEffect } from "react";
import { MovieDetail, MovieRating } from "@/types/movie";

interface MovieModalProps {
  movie: MovieDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

function RatingBadge({ rating }: { rating: MovieRating }) {
  const colorMap: Record<string, string> = {
    "Internet Movie Database": "bg-yellow-600",
    "Rotten Tomatoes": "bg-red-600",
    Metacritic: "bg-blue-600",
  };

  const bgClass = colorMap[rating.Source] || "bg-gray-600";

  return (
    <div
      className={`${bgClass} rounded-lg px-4 py-2 text-center min-w-[90px]`}
    >
      <p className="text-xs text-white/70 uppercase tracking-wider">
        {rating.Source}
      </p>
      <p className="text-xl font-bold text-white">{rating.Value}</p>
    </div>
  );
}

export default function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !movie) return null;

  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={movie.Title}
    >
      {/* Backdrop — closes on click */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh]
                     overflow-y-auto border border-white/10 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/60 hover:bg-red-600
                     rounded-full flex items-center justify-center text-white
                     transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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

        {/* Poster */}
        {hasPoster && (
          <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- External OMDb URLs, unoptimized */}
            <img
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Details */}
        <div className="p-6">
          {/* Title & basic info */}
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {movie.Title}
          </h2>

          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-sm text-gray-300">
            {movie.Year !== "N/A" && <span>{movie.Year}</span>}
            {movie.Rated !== "N/A" && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-yellow-400 font-semibold">
                  {movie.Rated}
                </span>
              </>
            )}
            {movie.Runtime !== "N/A" && (
              <>
                <span className="text-gray-500">•</span>
                <span>{movie.Runtime}</span>
              </>
            )}
            {movie.Genre !== "N/A" && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-green-400">{movie.Genre}</span>
              </>
            )}
          </div>

          {/* Plot */}
          {movie.Plot !== "N/A" && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Sinopsis
              </h3>
              <p className="text-gray-200 leading-relaxed">{movie.Plot}</p>
            </div>
          )}

          {/* Crew */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {movie.Director !== "N/A" && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Director
                </h3>
                <p className="text-gray-200">{movie.Director}</p>
              </div>
            )}
            {movie.Writer !== "N/A" && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Escritor
                </h3>
                <p className="text-gray-200">{movie.Writer}</p>
              </div>
            )}
            {movie.Actors !== "N/A" && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Actores
                </h3>
                <p className="text-gray-200">{movie.Actors}</p>
              </div>
            )}
          </div>

          {/* Ratings */}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Calificaciones
              </h3>
              <div className="flex flex-wrap gap-3">
                {movie.Ratings.map((rating) => (
                  <RatingBadge key={rating.Source} rating={rating} />
                ))}
              </div>
            </div>
          )}

          {/* Awards & Box Office */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {movie.Awards &&
              movie.Awards !== "N/A" && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Premios
                  </h3>
                  <p className="text-gray-200">{movie.Awards}</p>
                </div>
              )}
            {movie.BoxOffice &&
              movie.BoxOffice !== "N/A" && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Taquilla
                  </h3>
                  <p className="text-gray-200">{movie.BoxOffice}</p>
                </div>
              )}
          </div>

          {/* Released & Country */}
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            {movie.Released !== "N/A" && (
              <div>
                <span className="text-gray-400">Estreno: </span>
                <span className="text-gray-300">{movie.Released}</span>
              </div>
            )}
            {movie.Country !== "N/A" && (
              <div>
                <span className="text-gray-400">País: </span>
                <span className="text-gray-300">{movie.Country}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
