import type { WeatherData } from "@/types/weather";
import { weatherCodeDescription } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
  title: string;
  city?: string;
  variant: "ssr" | "csr";
  children?: React.ReactNode;
}

/**
 * Shared WeatherCard component used by both SSR (Lima) and CSR (City Widget).
 *
 * Renders:
 * - Colored badge dot (green = SSR, blue = CSR) + title
 * - Optional city name display
 * - Temperature in °C
 * - Wind speed in km/h
 * - Human-readable weather description (via weatherCodeDescription)
 * - Children slot for extra content (info box, selector, etc.)
 */
export default function WeatherCard({
  weather,
  title,
  city,
  variant,
  children,
}: WeatherCardProps) {
  const badgeColor = variant === "ssr" ? "bg-green-500" : "bg-blue-500";
  const { temperature, windspeed, weathercode } = weather.current_weather;

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 border-4 border-white">
      {/* Header with badge dot */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 ${badgeColor} rounded-full animate-pulse`} />
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      {/* City name (optional) */}
      {city && <p className="text-lg text-gray-500 mb-4">{city}</p>}

      {/* Temperature */}
      <div className="text-6xl font-bold text-blue-600 mb-2">
        {temperature}°C
      </div>

      {/* Wind speed */}
      <p className="text-gray-600">Viento: {windspeed} km/h</p>

      {/* Weather description */}
      <p className="text-gray-500 mt-1 text-sm">
        {weatherCodeDescription(weathercode)}
      </p>

      {/* Extra content slot */}
      {children}
    </div>
  );
}
