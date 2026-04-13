import { searchHistoryRepository } from "../repositories/search-history.repository";
import {
  forecastPayloadSchema,
  geocodingPayloadSchema,
} from "../schemas/open-meteo.payload.schema";
import { WeatherResult } from "../types/weather.types";
import { AppError, HTTP_STATUS } from "../utils/error";
import { parseOrThrow } from "../utils/parse-or-throw";

// ── Service ───────────────────────────────────────────────────────────────

async function fetchJson(url: string): Promise<unknown> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new AppError(
        HTTP_STATUS.BAD_GATEWAY,
        `Upstream request failed: ${response.status}`,
      );
    }
    return response.json();
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new AppError(HTTP_STATUS.BAD_GATEWAY, `Weather service unavailable`);
  }
}

export async function getWeatherByCity(city: string): Promise<WeatherResult> {
  // 1. Geocode
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoRaw = await fetchJson(geoUrl);
  const geoData = parseOrThrow(
    geocodingPayloadSchema,
    geoRaw,
    "Invalid geocoding response",
    HTTP_STATUS.NOT_FOUND,
  );

  const { latitude, longitude, name, country } = geoData.results[0];

  // 2. Forecast — current_weather + first hourly humidity reading
  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&timezone=auto`;

  const forecastRaw = await fetchJson(forecastUrl);
  const forecast = parseOrThrow(
    forecastPayloadSchema,
    forecastRaw,
    "Invalid forecast response",
  );

  const {
    temperature_2m: temperature,
    wind_speed_10m: windspeed,
    weather_code: weathercode,
    relative_humidity_2m: humidity,
  } = forecast.current;

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

