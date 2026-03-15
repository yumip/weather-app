import { AppDataSource } from "../../data-source";
import { SearchHistory } from "../entities/search-history.entity";

// Shape returned to the handler — matches the frontend HistoryItem schema exactly
export interface HistoryResponseItem {
  city: string;
  temperature: number;
  timestamp: string;
}

const HISTORY_LIMIT = 5;

const repo = () => AppDataSource.getRepository(SearchHistory);

export const searchHistoryRepository = {
  async save(city: string, temperature: number): Promise<SearchHistory> {
    const entry = repo().create({ city, temperature });
    return repo().save(entry);
  },

  async findRecent(): Promise<HistoryResponseItem[]> {
    const rows = await repo().find({
      select: ["city", "temperature", "timestamp"],
      order: { timestamp: "DESC" },
      take: HISTORY_LIMIT,
    });

    // pg returns numeric columns as strings — coerce to number explicitly
    return rows.map((row) => ({
      city: row.city,
      temperature: Number(row.temperature),
      timestamp:
        row.timestamp instanceof Date
          ? row.timestamp.toISOString()
          : String(row.timestamp),
    }));
  },
};
