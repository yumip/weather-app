import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../api/weather.api";
import { type WeatherData } from "../schemas/weather.schema";
import {
  WEATHER_QUERY_KEYS,
  WEATHER_STALE_TIME_MS,
} from "../constants/query.constants";

export function useWeather(city: string) {
  return useQuery<WeatherData, Error>({
    queryKey: WEATHER_QUERY_KEYS.byCity(city),
    queryFn: () => getWeather(city),
    enabled: city.trim().length > 0,
    staleTime: WEATHER_STALE_TIME_MS,
    retry: 1,
  });
}
