import { Card, CardContent, Typography, Divider, Grid } from '@mui/material';
import { WeatherMetric } from './WeatherMetric';
import { type WeatherData } from '../schemas/weather.schema';
import { METRIC_CONFIG, METRIC_KEYS } from '../constants/metric.constants';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { city, country, timestamp } = data;

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {city}
          {country && (
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1 }}>
              {country}
            </Typography>
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Updated at {formattedTime}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3} justifyContent="space-around">
          {METRIC_KEYS.map((key) => {
            const { label, unit, icon } = METRIC_CONFIG[key];
            return (
              <Grid key={key} size={{ xs: 6, sm: 3 }}>
                <WeatherMetric label={label} value={data[key]} unit={unit} icon={icon} />
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
