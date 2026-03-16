import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';

export function renderWithTheme(
  ui: React.ReactElement,
  options?: RenderOptions,
): RenderResult {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
}
