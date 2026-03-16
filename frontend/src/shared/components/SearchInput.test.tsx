import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';
import { renderWithTheme } from '../../test/render';

const onSubmit = vi.fn();

const defaultProps = {
  value: 'Sydney',
  onChange: vi.fn(),
  onSubmit,
  loading: false,
};

describe('SearchInput', () => {
  beforeEach(() => onSubmit.mockClear());

  it('calls onSubmit when the search button is clicked', async () => {
    renderWithTheme(<SearchInput {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search weather' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Enter is pressed', async () => {
    renderWithTheme(<SearchInput {...defaultProps} />);
    await userEvent.type(screen.getByRole('textbox'), '{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the button when loading is true', () => {
    renderWithTheme(<SearchInput {...defaultProps} loading />);
    expect(screen.getByRole('button', { name: 'Search weather' })).toBeDisabled();
  });

  it('disables the button when value is empty', () => {
    renderWithTheme(<SearchInput {...defaultProps} value="" />);
    expect(screen.getByRole('button', { name: 'Search weather' })).toBeDisabled();
  });
});
