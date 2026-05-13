import axios from "axios";
import type { OMDbSearchResponse, MovieDetail } from "@/types/movie";

const OMDB_BASE_URL = "https://www.omdbapi.com";

function getApiKey(): string {
  // Works in both server and client contexts.
  // Server Components read OMDB_API_KEY; Client Components read NEXT_PUBLIC_OMDB_API_KEY.
  const key = process.env.NEXT_PUBLIC_OMDB_API_KEY || process.env.OMDB_API_KEY;
  if (!key) {
    throw new Error("OMDB_API_KEY is not configured in environment");
  }
  return key;
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<OMDbSearchResponse> {
  const { data } = await axios.get<OMDbSearchResponse>(OMDB_BASE_URL, {
    params: {
      apikey: getApiKey(),
      s: query,
      page,
    },
  });
  return data;
}

export async function getMovieDetail(imdbID: string): Promise<MovieDetail> {
  const { data } = await axios.get<MovieDetail>(OMDB_BASE_URL, {
    params: {
      apikey: getApiKey(),
      i: imdbID,
      plot: "full",
    },
  });
  return data;
}
