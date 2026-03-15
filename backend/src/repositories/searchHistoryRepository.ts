import { AppDataSource } from "../data-source";
import { SearchHistory } from "../weather/entities/search-history.entity";

const repo = () => AppDataSource.getRepository(SearchHistory);

export const searchHistoryRepository = {
  async save(city: string, temperature: number): Promise<SearchHistory> {
    const entry = repo().create({ city, temperature });
    return repo().save(entry);
  },

  async findRecent(limit: number): Promise<SearchHistory[]> {
    return repo().find({
      order: { timestamp: "DESC" },
      take: limit,
    });
  },
};
