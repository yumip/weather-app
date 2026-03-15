import { getWeatherByCity } from "../services/weather.service";
import { searchHistoryRepository } from "../repositories/search-history.repository";
import {
  err,
  HandlerEvent,
  HandlerResponse,
  ok,
} from "./weather.handler.contract";
import { cityQuerySchema } from "../schemas/weather-query.schema";
import { getWeatherCondition } from "../utils/weather-code";

export async function handleGetWeather(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  const parsed = cityQuerySchema.safeParse(event.queryStringParameters ?? {});
  if (!parsed.success) {
    return err(400, parsed.error.issues[0]?.message ?? "Invalid query");
  }

  try {
    const result = await getWeatherByCity(parsed.data.city);
    return ok({
      ...result,
      condition: getWeatherCondition(result.weatherCode),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    const isNotFound = message.toLowerCase().includes("city not found");
    return err(isNotFound ? 404 : 502, message);
  }
}

export async function handleGetHistory(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  const limitParam = event.queryStringParameters?.limit;
  const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10;

  try {
    const history = await searchHistoryRepository.findRecent(limit);
    return ok(history);
  } catch {
    return err(503, "History unavailable");
  }
}
