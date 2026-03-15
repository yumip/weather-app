// WMO Weather interpretation codes — source: https://open-meteo.com/en/docs
// "WW" codes as used in the Open-Meteo current_weather.weathercode field.

export const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle: light',
  53: 'Drizzle: moderate',
  55: 'Drizzle: dense',
  56: 'Freezing drizzle: light',
  57: 'Freezing drizzle: heavy',
  61: 'Rain: slight',
  63: 'Rain: moderate',
  65: 'Rain: heavy',
  66: 'Freezing rain: light',
  67: 'Freezing rain: heavy',
  71: 'Snow: slight',
  73: 'Snow: moderate',
  75: 'Snow: heavy',
  77: 'Snow grains',
  80: 'Rain showers: slight',
  81: 'Rain showers: moderate',
  82: 'Rain showers: violent',
  85: 'Snow showers: slight',
  86: 'Snow showers: heavy',
  95: 'Thunderstorm: slight or moderate',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export function getWeatherCondition(code: number): string {
  return WEATHER_CODE_DESCRIPTIONS[code] ?? 'Unknown';
}
