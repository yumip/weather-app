import { getWeatherByCity } from './weather.service';
import { searchHistoryRepository } from '../repositories/search-history.repository';

jest.mock('../repositories/search-history.repository', () => ({
  searchHistoryRepository: {
    save: jest.fn().mockResolvedValue(undefined),
  },
}));

const geoResponse = {
  results: [{ name: 'Sydney', latitude: -33.87, longitude: 151.21, country: 'Australia' }],
};

const forecastResponse = {
  current: { temperature_2m: 22, wind_speed_10m: 15, relative_humidity_2m: 60, weather_code: 0 },
};

function mockFetch(...responses: object[]) {
  let call = 0;
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(responses[call++]) }),
  ) as jest.MockedFunction<typeof fetch>;
}

describe('getWeatherByCity', () => {
  beforeEach(() => mockFetch(geoResponse, forecastResponse));

  it('returns a correctly shaped WeatherResult', async () => {
    const result = await getWeatherByCity('Sydney');
    expect(result).toMatchObject({
      city: 'Sydney',
      country: 'Australia',
      temperature: 22,
      windSpeed: 15,
      humidity: 60,
      weatherCode: 0,
      unit: 'celsius',
    });
    expect(typeof result.timestamp).toBe('string');
  });

  it('saves to search history with city and temperature', async () => {
    await getWeatherByCity('Sydney');
    expect(searchHistoryRepository.save).toHaveBeenCalledWith('Sydney', 22);
  });

  it('throws WeatherError when the city is not found', async () => {
    mockFetch({ results: [] }, forecastResponse);
    await expect(getWeatherByCity('Nowhere')).rejects.toThrow();
  });
});
