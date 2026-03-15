export interface WeatherResult {
  city: string;
  country: string | undefined;
  temperature: number;
  unit: "celsius";
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  timestamp: string;
}
