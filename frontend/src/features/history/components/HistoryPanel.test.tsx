import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type UseQueryResult } from '@tanstack/react-query';
import { HistoryPanel } from './HistoryPanel';
import { renderWithTheme } from '../../../test/render';
import { useHistory } from '../hooks/useHistory';
import { type HistoryItem } from '../schemas/history.schema';

vi.mock('../hooks/useHistory');

const mockItems: HistoryItem[] = [
  { city: 'Sydney', temperature: 22, timestamp: '2024-01-01T10:00:00.000Z' },
  { city: 'Melbourne', temperature: 18, timestamp: '2024-01-01T09:00:00.000Z' },
  { city: 'Brisbane', temperature: 27, timestamp: '2024-01-01T08:00:00.000Z' },
  { city: 'Perth', temperature: 30, timestamp: '2024-01-01T07:00:00.000Z' },
  { city: 'Adelaide', temperature: 25, timestamp: '2024-01-01T06:00:00.000Z' },
];

function stubHistory(data: HistoryItem[]) {
  vi.mocked(useHistory).mockReturnValue({
    data,
    isLoading: false,
    isError: false,
    error: null,
  } as unknown as UseQueryResult<HistoryItem[], Error>);
}

describe('HistoryPanel', () => {
  it('renders five recent search items', () => {
    stubHistory(mockItems);
    renderWithTheme(<HistoryPanel onSelect={vi.fn()} />);
    for (const { city } of mockItems) {
      expect(screen.getByText(city)).toBeInTheDocument();
    }
  });

  it('calls onSelect with the city name when an item is clicked', async () => {
    const onSelect = vi.fn();
    stubHistory(mockItems);
    renderWithTheme(<HistoryPanel onSelect={onSelect} />);
    await userEvent.click(screen.getByText('Sydney'));
    expect(onSelect).toHaveBeenCalledWith('Sydney');
  });

  it('shows empty-state text when there are no items', () => {
    stubHistory([]);
    renderWithTheme(<HistoryPanel onSelect={vi.fn()} />);
    expect(screen.getByText('No recent searches')).toBeInTheDocument();
  });
});
