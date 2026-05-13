/**
 * Pokémon CSR — Client-Side Rendering
 *
 * 🔍 DevTools verification:
 * 1. Open Network tab → reload page → see XHR/fetch to pokeapi.co/api/v2/pokemon/{id}
 * 2. Open React DevTools → Components tab → see state updates (pokemon, loading, error)
 * 3. View page source (Ctrl+U) → HTML is an empty shell (no Pokémon data in initial HTML)
 * 4. Disable JavaScript → page shows nothing (because rendering depends on JS)
 */

"use client";

import { useState, useEffect } from "react";
import type { PokemonDetail } from "@/types/pokemon";
import { fetchPokemonDetail } from "@/lib/api/pokeapi";
import PokemonCard from "./PokemonCard";

export default function PokemonCSRPage() {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomPokemon = async () => {
    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const randomId = Math.floor(Math.random() * 150) + 1;
      const data = await fetchPokemonDetail(randomId);
      setPokemon(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al obtener el Pokémon"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Deliberate CSR pattern: fetch data on mount via effect.
    // This is the classic Client-Side Rendering approach being demonstrated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRandomPokemon();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
        Pokémon — Client-Side Rendering
      </h1>

      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500" />
          <p className="text-white font-semibold text-lg">Cargando Pokémon...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-700 font-bold text-lg mb-2">⚠ Error</p>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRandomPokemon}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {pokemon && !loading && !error && (
        <div className="flex flex-col items-center gap-4">
          <PokemonCard pokemon={pokemon} />
          <button
            onClick={fetchRandomPokemon}
            className="mt-6 px-6 py-3 bg-yellow-400 text-black font-extrabold rounded-full border-4 border-black hover:bg-yellow-300 transition-colors text-lg"
          >
            🔄 Otro Pokémon
          </button>
        </div>
      )}
    </div>
  );
}
