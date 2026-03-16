import Alert from "@mui/material/Alert";

export function ErrorState({ error }: { error: Error }) {
  return (
    <Alert severity="error">
      {error?.message ?? "Could not load weather data. Please try again."}
    </Alert>
  );
}
