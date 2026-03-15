export const WEATHER_QUERY_KEYS = {
  byCity: (city: string) => ['weather', city] as const,
} as const;

export const WEATHER_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
