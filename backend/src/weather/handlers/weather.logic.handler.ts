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
import { AppError, HTTP_STATUS } from "../utils/error";

export async function handleGetWeather(
  event: HandlerEvent,
): Promise<HandlerResponse> {
  const parsed = cityQuerySchema.safeParse(event.queryStringParameters ?? {});
  if (!parsed.success) {
    return err(
      HTTP_STATUS.BAD_REQUEST,
      parsed.error.issues[0]?.message ?? "Invalid query",
    );
  }

  try {
    const result = await getWeatherByCity(parsed.data.city);

    return ok({
      ...result,
      condition: getWeatherCondition(result.weatherCode),
    });
  } catch (e) {
    if (e instanceof AppError) {
      return err(e.statusCode, e.message);
    }

    return err(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
  }
}

export async function handleGetHistory(
  _event: HandlerEvent,
): Promise<HandlerResponse> {
  try {
    const history = await searchHistoryRepository.findRecent();
    return ok(history);
  } catch {
    return err(HTTP_STATUS.SERVICE_UNAVAILABLE, "History unavailable");
  }
}
