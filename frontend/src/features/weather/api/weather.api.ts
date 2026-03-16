import { fetchAndParseJson } from "../../../lib/api/fetchAndParse";
import { METHOD_TYPES, RequestFactory } from "../../../lib/api/requestFactory";
import { weatherSchema, type WeatherData } from "../schemas/weather.schema";

export async function getWeather(city: string): Promise<WeatherData> {
  const request = RequestFactory.createRequest(
    METHOD_TYPES.GET,
    `/api/weather?city=${encodeURIComponent(city)}`,
  );
  const raw = await fetchAndParseJson<unknown>(request);
  return weatherSchema.parse(raw);
}
