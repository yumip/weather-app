import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { WeatherCard } from './WeatherCard';
import { renderWithTheme } from '../../../test/render';
import { type WeatherData } from '../schemas/weather.schema';

const mockData: WeatherData = {
  city: 'Sydney',
  country: 'Australia',
  temperature: 22,
  condition: 'Clear sky',
  windSpeed: 15,
  humidity: 60,
  unit: 'celsius',
  timestamp: '2024-01-01T12:00:00.000Z',
};

describe('WeatherCard', () => {
  it('renders city and country', () => {
    renderWithTheme(<WeatherCard data={mockData} />);
    expect(screen.getByText('Sydney')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });

  it('renders all four metric labels', () => {
    renderWithTheme(<WeatherCard data={mockData} />);
    for (const label of ['Temperature', 'Condition', 'Wind Speed', 'Humidity']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('renders condition text and temperature unit', () => {
    renderWithTheme(<WeatherCard data={mockData} />);
    expect(screen.getByText('Clear sky')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  });
});
