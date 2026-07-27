"use client";

import { useEffect } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Hubsom Admin]", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        textAlign: "center",
      }}
    >
      <Stack spacing={2} alignItems="center" maxWidth={420}>
        <Typography variant="h5" fontWeight={800} letterSpacing="-0.03em">
          This page couldn’t load
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Something went wrong while rendering this screen. You can try again or go back to the dashboard.
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" onClick={reset} sx={{ bgcolor: "#0a3d5c" }}>
            Reload
          </Button>
          <Button variant="outlined" href="/">
            Back
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
