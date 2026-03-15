import { useState } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { SearchInput } from "../../history/components/SearchInput";
import { WeatherCard } from "../components/WeatherCard";
import { useWeather } from "../hooks/useWeather";

export function WeatherPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const { data, isLoading, isError, error } = useWeather(searchCity);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setSearchCity(trimmed);
  };

  const renderResults = () => {
    if (isLoading) {
      return <CircularProgress />;
    }
    if (isError) {
      return (
        <Alert severity="error">
          {error?.message ?? "Could not load weather data. Please try again."}
        </Alert>
      );
    }
    if (data) {
      return <WeatherCard data={data} />;
    }
    if (searchCity) {
      return (
        <Typography variant="body2" color="text.secondary" align="center">
          No results found for &ldquo;{searchCity}&rdquo;
        </Typography>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <SearchInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        loading={isLoading}
        placeholder="Enter city name…"
      />
      {renderResults()}
    </Box>
  );
}
