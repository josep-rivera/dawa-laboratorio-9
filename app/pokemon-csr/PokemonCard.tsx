import type { PokemonDetail } from "@/types/pokemon";
import { getPokemonSprite } from "@/lib/api/pokeapi";

/** Map Pokémon type names to Tailwind background color classes */
const typeColorMap: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-600",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-400",
};

function getTypeColor(typeName: string): string {
  return typeColorMap[typeName] ?? "bg-gray-400";
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface PokemonCardProps {
  pokemon: PokemonDetail;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const sprite = getPokemonSprite(pokemon);

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="bg-yellow-400 text-center py-3 px-6 rounded-t-xl border-4 border-black">
        <h2 className="text-2xl font-extrabold text-black">
          {capitalize(pokemon.name)}
        </h2>
        <p className="text-sm font-semibold text-gray-800">
          #{String(pokemon.id).padStart(3, "0")}
        </p>
      </div>

      {/* Card body */}
      <div className="bg-white rounded-b-xl shadow-2xl p-8 border-4 border-t-0 border-black">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sprite}
            alt={pokemon.name}
            className="w-48 h-48 object-contain drop-shadow-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {pokemon.types.map((t) => (
            <span
              key={t.slot}
              className={`px-4 py-2 ${getTypeColor(t.type.name)} text-white rounded-full font-semibold text-sm`}
            >
              {capitalize(t.type.name)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
