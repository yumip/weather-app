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
import { WeatherError } from "../utils/error";

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
    if (e instanceof WeatherError) {
      return err(e.statusCode, e.message);
    }
    return err(500, "Internal server error");
  }
}

export async function handleGetHistory(
  _event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const history = await searchHistoryRepository.findRecent();
    return ok(history);
  } catch {
    return err(503, "History unavailable");
  }
}
