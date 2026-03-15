import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';
import weatherRoutes from './weather/routes/weather.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());
app.use('/api', weatherRoutes);

async function start(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.info('Database connected');
  } catch {
    console.warn('Database unavailable — history feature disabled');
  }

  app.listen(PORT, () => {
    console.info(`Backend running on http://localhost:${PORT}`);
  });
}

start();

export { app };
