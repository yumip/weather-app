import { searchHistoryRepository } from "../repositories/search-history.repository";
import {
  forecastPayloadSchema,
  geocodingPayloadSchema,
} from "../schemas/open-meteo.payload.schema";
import { WeatherResult } from "../types/weather.types";
import { parseOrThrow } from "../utils/parse-or-throw";

// ── Service ───────────────────────────────────────────────────────────────

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Upstream request failed: ${response.status} ${url}`);
  }
  return response.json();
}

export async function getWeatherByCity(city: string): Promise<WeatherResult> {
  // 1. Geocode
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoRaw = await fetchJson(geoUrl);
  const geoData = parseOrThrow(
    geocodingPayloadSchema,
    geoRaw,
    "Invalid geocoding response",
  );

  const { latitude, longitude, name, country } = geoData.results[0];

  // 2. Forecast — current_weather + first hourly humidity reading
  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true` +
    `&hourly=relativehumidity_2m` +
    `&forecast_days=1` +
    `&timezone=auto`;

  const forecastRaw = await fetchJson(forecastUrl);
  const forecast = parseOrThrow(
    forecastPayloadSchema,
    forecastRaw,
    "Invalid forecast response",
  );

  const { temperature, windspeed, weathercode } = forecast.current_weather;
  const humidity = forecast.hourly.relativehumidity_2m[0] ?? 0;

  // 3. Persist (non-blocking — DB being down must not fail the weather response)
  try {
    await searchHistoryRepository.save(name, temperature);
  } catch (e) {
    console.warn(
      "[history] persist failed:",
      e instanceof Error ? e.message : e,
    );
  }

  return {
    city: name,
    country,
    temperature,
    unit: "celsius",
    windSpeed: windspeed,
    humidity,
    weatherCode: weathercode,
    timestamp: new Date().toISOString(),
  };
}
