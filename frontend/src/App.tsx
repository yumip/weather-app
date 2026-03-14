import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, Container, Typography } from '@mui/material';
import theme from './theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Weather Intelligence Dashboard
          </Typography>
          {/* WeatherFeature and HistoryList will be composed here in Prompt 3 & 4 */}
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
