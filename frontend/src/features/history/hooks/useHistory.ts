import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../api/history.api";
import { type HistoryItem } from "../schemas/history.schema";
import { HISTORY_QUERY_KEYS } from "../constants/query.constants";

export function useHistory() {
  return useQuery<HistoryItem[], Error>({
    queryKey: HISTORY_QUERY_KEYS.list,
    queryFn: () => getHistory(),
    staleTime: 0,
    retry: 0,
  });
}
