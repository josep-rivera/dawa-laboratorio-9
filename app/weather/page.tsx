/**
 * WEATHER DASHBOARD — Hybrid Rendering (SSR + CSR)
 *
 * ## Hybrid Verification Guide
 *
 * | Check                          | SSR Lima Card                        | CSR City Widget                      |
 * |--------------------------------|--------------------------------------|--------------------------------------|
 * | **View Source (Ctrl+U)**       | Temperature, wind, description       | Only dropdown HTML — NO weather data |
 * |                                | are embedded in initial HTML         | (fetched client-side after mount)    |
 * | **Network Tab**                | No client-side API call for Lima     | XHR to api.open-meteo.com visible   |
 * | **Disable JavaScript**         | Weather still displayed              | Weather data NOT shown               |
 * | **City change**                | N/A (static)                         | Fetches new data, no page reload     |
 *
 * ## Architecture
 * - SSR: Server fetches Lima weather at request time via `fetchWeatherData()`.
 *   Data is serialized into the HTML response — SEO-friendly, instant paint.
 * - CSR: `ClientWeatherWidget` renders the dropdown shell server-side,
 *   then fetches weather client-side on mount and on city change via
 *   `useEffect`. No page reload, interactive.
 *
 * ## Verification Steps
 * 1. Open `/weather` in browser
 * 2. Open DevTools → Network tab
 * 3. Hard-reload: Lima data arrives in HTML (no API call visible in Network)
 * 4. City widget: API call visible; change city → new request fires
 * 5. View Source: Lima temperature in HTML; widget temperature NOT in HTML
 * 6. Disable JS: Lima still visible; widget shows only dropdown (no data)
 */

import { fetchWeatherData } from "@/lib/api/open-meteo";
import WeatherCard from "./WeatherCard";
import ClientWeatherWidget from "./ClientWeatherWidget";

/**
 * Server-side fetch for Lima, Perú weather.
 * Runs at request time — data is embedded in the initial HTML response.
 */
async function getLimaWeather() {
  return fetchWeatherData(-12.04, -77.03);
}

export default async function WeatherDashboard() {
  const limaWeather = await getLimaWeather();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page title */}
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          ☁️ Dashboard del Clima
        </h1>

        {/* 2-column grid: SSR + CSR */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* === SSR Card: Lima, Perú === */}
          <WeatherCard
            weather={limaWeather}
            title="Lima - SSR"
            variant="ssr"
          >
            <div className="mt-4 p-3 bg-green-50 rounded-lg border-2 border-green-200">
              <p className="text-xs text-green-800">
                ✅ Datos obtenidos en el servidor — SEO friendly
              </p>
            </div>
          </WeatherCard>

          {/* === CSR Card: Interactive City Widget === */}
          <ClientWeatherWidget />
        </div>
      </div>
    </div>
  );
}
