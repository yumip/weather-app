import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { app } from "./app";

const PORT = process.env.PORT ?? 3001;

export async function start(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.info("Database connected");
  } catch {
    console.warn("Database unavailable — history feature disabled");
  }

  app.listen(PORT, () => {
    console.info(`Backend running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  void start();
}
