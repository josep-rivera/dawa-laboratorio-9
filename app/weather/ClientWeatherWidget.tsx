/**
 * CLIENT-WEATHER WIDGET — Hybrid Rendering (CSR side)
 *
 * ## Hybrid Verification
 * - **View Source (Ctrl+U)**: Widget shell and city selector HTML are rendered
 *   server-side (static), but weather data (temperature, wind, description) is
 *   NOT in the initial HTML. It arrives via client-side fetch after JavaScript
 *   hydration.
 * - **Network Tab**: After page load, you'll see an XHR/fetch request to
 *   `api.open-meteo.com`. Changing the city triggers another request —
 *   no full page reload.
 * - **Disable JavaScript**: If you disable JS, the widget will NOT update
 *   weather data. The dropdown still renders (server HTML), but the data
 *   fetch (useEffect) won't run. The SSR Lima card still shows weather
 *   because its data is embedded in the initial HTML.
 */

"use client";

import { useState, useEffect } from "react";
import { fetchWeatherData } from "@/lib/api/open-meteo";
import type { WeatherResponse } from "@/types/weather";
import { weatherCodeDescription } from "@/types/weather";

const CITIES = {
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  "New York": { lat: 40.7128, lon: -74.006 },
  London: { lat: 51.5074, lon: -0.1278 },
  Sydney: { lat: -33.8688, lon: 151.2093 },
} as const;

type CityKey = keyof typeof CITIES;

export default function ClientWeatherWidget() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<CityKey>("Tokyo");

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const coords = CITIES[city];
        const data = await fetchWeatherData(coords.lat, coords.lon);
        if (!cancelled) {
          setWeather(data);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [city]);

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 border-4 border-white">
      {/* CSR Header with blue badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-800">Mundo - CSR</h2>
      </div>

      {/* City selector dropdown */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value as CityKey)}
        className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg font-semibold
                   text-gray-700 hover:border-blue-500 transition focus:outline-none
                   focus:border-blue-500"
      >
        {Object.keys(CITIES).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Loading spinner */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Cargando clima...</p>
        </div>
      )}

      {/* Weather data display */}
      {!loading && weather && (
        <>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {weather.current_weather.temperature}°C
          </div>
          <p className="text-gray-600">
            Viento: {weather.current_weather.windspeed} km/h
          </p>
          <p className="text-gray-500 mt-1 text-sm">
            {weatherCodeDescription(weather.current_weather.weathercode)}
          </p>

          {/* CSR info box */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-xs text-blue-800">
              🔄 Datos obtenidos en el cliente — interactivo sin recargar
            </p>
          </div>
        </>
      )}

      {/* Error fallback */}
      {!loading && !weather && (
        <div className="text-center py-8 text-gray-500">
          <p>No se pudo cargar el clima. Intenta de nuevo.</p>
        </div>
      )}
    </div>
  );
}
