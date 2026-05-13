/**
 * Pokémon SSR — Server-Side Rendering
 *
 * 🔍 DevTools verification:
 * 1. Open Network tab → reload page → NO client-side fetch to PokeAPI (data already in HTML)
 * 2. View page source (Ctrl+U) → Pokémon name, sprite URL, and types are in the initial HTML
 * 3. Disable JavaScript → page still shows Pokémon (HTML rendered on server)
 * 4. Compare with /pokemon-csr: Network tab shows zero API calls here vs one there
 */

import type { PokemonDetail } from "@/types/pokemon";
import { fetchPokemonDetail } from "@/lib/api/pokeapi";
import PokemonCard from "@/app/pokemon-csr/PokemonCard";

async function getPokemon(): Promise<PokemonDetail> {
  const randomId = Math.floor(Math.random() * 150) + 1;
  return fetchPokemonDetail(randomId);
}

export default async function PokemonSSRPage() {
  const pokemon = await getPokemon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
        Pokémon — Server-Side Rendering
      </h1>

      <PokemonCard pokemon={pokemon} />

      <p className="mt-8 text-white/80 text-sm font-medium">
        Esta página se renderiza completamente en el servidor.
        Recarga la página para ver otro Pokémon aleatorio.
      </p>
    </div>
  );
}
