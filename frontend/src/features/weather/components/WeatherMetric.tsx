import { type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface WeatherMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
}

export function WeatherMetric({ label, value, unit, icon }: WeatherMetricProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      {icon && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
      )}
      <Typography variant="subtitle2" color="text.secondary" align="center">
        {label}
      </Typography>
      <Typography variant="h6" component="p" align="center" sx={{ lineHeight: 1 }}>
        {value}
        {unit && (
          <Typography component="span" variant="body2" sx={{ ml: 0.25 }}>
            {unit}
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
