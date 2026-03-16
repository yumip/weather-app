import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useHistory } from "../hooks/useHistory";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";

interface HistoryPanelProps {
  onSelect: (city: string) => void;
  disabled?: boolean;
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function HistoryPanel({
  onSelect,
  disabled = false,
}: HistoryPanelProps) {
  const { data: items = [], isError, error, isLoading } = useHistory();

  const renderResults = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (isError) {
      return <ErrorState error={error} />;
    }
    if (items.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No recent searches
        </Typography>
      );
    }
    return (
      <List disablePadding>
        {items.map((item, index) => (
          <Box key={`${item.city}-${item.timestamp}`}>
            <ListItemButton
              disableGutters
              disabled={disabled}
              onClick={() => onSelect(item.city)}
            >
              <ListItemText
                primary={item.city}
                secondary={formatTimestamp(item.timestamp)}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {item.temperature}°C
              </Typography>
            </ListItemButton>
            {index < items.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    );
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <HistoryIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" color="text.secondary">
          Recent Searches
        </Typography>
      </Box>
      {renderResults()}
    </Box>
  );
}
