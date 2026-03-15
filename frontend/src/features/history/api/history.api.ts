import { fetchAndParseJson } from "../../../lib/api/fetchAndParse";
import { METHOD_TYPES, RequestFactory } from "../../../lib/api/requestFactory";
import { historySchema, type HistoryItem } from "../schemas/history.schema";

export async function getHistory(): Promise<HistoryItem[]> {
  const request = RequestFactory.createRequest(
    METHOD_TYPES.GET,
    "/api/history",
  );
  const raw = await fetchAndParseJson<HistoryItem[]>(request);
  return historySchema.parse(raw);
}
