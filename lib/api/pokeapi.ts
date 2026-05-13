import axios from "axios";
import type {
  PokemonListResponse,
  PokemonDetail,
} from "@/types/pokemon";

const pokeapiClient = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const { data } = await pokeapiClient.get<PokemonListResponse>("/pokemon", {
    params: { limit, offset },
  });
  return data;
}

export async function fetchPokemonDetail(
  nameOrId: string | number
): Promise<PokemonDetail> {
  const { data } = await pokeapiClient.get<PokemonDetail>(
    `/pokemon/${nameOrId}`
  );
  return data;
}

export async function fetchPokemonDetailByUrl(
  url: string
): Promise<PokemonDetail> {
  const { data } = await axios.get<PokemonDetail>(url);
  return data;
}

export function getPokemonSprite(pokemon: PokemonDetail): string {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default
  );
}
