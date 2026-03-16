import { type ReactNode } from "react";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

export type MetricKey = "temperature" | "condition" | "windSpeed" | "humidity";

export interface MetricConfig {
  label: string;
  unit?: string;
  icon: ReactNode;
}

export const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {
  temperature: {
    label: "Temperature",
    unit: "°C",
    icon: <ThermostatIcon color="primary" fontSize="large" />,
  },
  condition: {
    label: "Condition",
    icon: <WbSunnyIcon color="primary" fontSize="large" />,
  },
  windSpeed: {
    label: "Wind Speed",
    unit: "km/h",
    icon: <AirIcon color="primary" fontSize="large" />,
  },
  humidity: {
    label: "Humidity",
    unit: "%",
    icon: <WaterDropIcon color="primary" fontSize="large" />,
  },
};

export const METRIC_KEYS = Object.keys(METRIC_CONFIG) as MetricKey[];
