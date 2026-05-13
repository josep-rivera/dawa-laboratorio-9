import axios from "axios";
import type { WeatherResponse } from "@/types/weather";

const openMeteoClient = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
  timeout: 10000,
});

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const { data } = await openMeteoClient.get<WeatherResponse>("/forecast", {
    params: {
      latitude,
      longitude,
      current_weather: true,
    },
  });
  return data;
}
