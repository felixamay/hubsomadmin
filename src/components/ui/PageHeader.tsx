"use client";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export function StatCard({
  label,
  value,
  hint,
  accent = "#0a3d5c",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid rgba(10,61,92,0.08)",
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(238,247,252,0.9) 100%)",
        position: "relative",
        overflow: "hidden",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 28px rgba(10,61,92,0.08)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: accent,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="body2" color="text.secondary" fontWeight={650}>
            {label}
          </Typography>
          <TrendingUpIcon sx={{ fontSize: 18, color: accent, opacity: 0.7 }} />
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 1, mb: 0.5, letterSpacing: "-0.03em" }}>
          {value}
        </Typography>
        {hint && (
          <Chip size="small" label={hint} sx={{ height: 22, fontSize: 11 }} />
        )}
      </CardContent>
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions}
    </Box>
  );
}
