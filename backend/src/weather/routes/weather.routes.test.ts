import express from 'express';
import request from 'supertest';
import weatherRoutes from './weather.routes';
import { getWeatherByCity } from '../services/weather.service';
import { searchHistoryRepository } from '../repositories/search-history.repository';
import { type WeatherResult } from '../types/weather.types';
import { type HistoryResponseItem } from '../repositories/search-history.repository';

jest.mock('../services/weather.service', () => ({
  getWeatherByCity: jest.fn(),
}));

jest.mock('../repositories/search-history.repository', () => ({
  searchHistoryRepository: { findRecent: jest.fn() },
}));

const app = express();
app.use(express.json());
app.use('/api', weatherRoutes);

const mockWeatherResult: WeatherResult = {
  city: 'Sydney',
  country: 'Australia',
  temperature: 22,
  windSpeed: 15,
  humidity: 60,
  weatherCode: 0,
  unit: 'celsius',
  timestamp: '2024-01-01T12:00:00.000Z',
};

describe('GET /api/weather', () => {
  it('returns 200 with weather data for a valid city', async () => {
    jest.mocked(getWeatherByCity).mockResolvedValue(mockWeatherResult);
    const res = await request(app).get('/api/weather?city=Sydney');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ city: 'Sydney', temperature: 22 });
  });

  it('returns 400 when the city query param is missing', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/history', () => {
  it('returns 200 with a history array', async () => {
    const items: HistoryResponseItem[] = [
      { city: 'Sydney', temperature: 22, timestamp: '2024-01-01T12:00:00.000Z' },
    ];
    jest.mocked(searchHistoryRepository.findRecent).mockResolvedValue(items);
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ city: 'Sydney' });
  });
});
