import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { SearchInput } from "../../history/components/SearchInput";
import { WeatherCard } from "../components/WeatherCard";
import { useWeather } from "../hooks/useWeather";
import { HistoryPanel } from "../../history/components/HistoryPanel";
import { HISTORY_QUERY_KEYS } from "../../history/constants/query.constants";
import { WEATHER_QUERY_KEYS } from "../constants/query.constants";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";

export function WeatherPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useWeather(searchCity);

  // Invalidate history after each successful weather fetch
  useEffect(() => {
    if (data) {
      void queryClient.invalidateQueries({ queryKey: HISTORY_QUERY_KEYS.list });
    }
  }, [data, queryClient]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) setSearchCity(trimmed);
  };

  const handleHistorySelect = (city: string) => {
    // Remove cached weather for this city so the query always fires fresh
    queryClient.removeQueries({ queryKey: WEATHER_QUERY_KEYS.byCity(city) });
    setInputValue(city);
    setSearchCity(city);
  };

  const renderResults = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (isError) {
      return <ErrorState error={error} />;
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

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        {/* Main weather panel */}
        <Box sx={{ flex: 1, minWidth: 0 }}>{renderResults()}</Box>

        {/* History sidebar */}
        <Paper variant="outlined" sx={{ width: 260, flexShrink: 0, p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <HistoryPanel onSelect={handleHistorySelect} disabled={isLoading} />
        </Paper>
      </Box>
    </Box>
  );
}
