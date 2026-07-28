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
          transform: { md: "translateY(-2px)" },
          boxShadow: { md: "0 10px 28px rgba(10,61,92,0.08)" },
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
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={650}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, lineHeight: 1.3 }}
          >
            {label}
          </Typography>
          <TrendingUpIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: accent, opacity: 0.7, flexShrink: 0 }} />
        </Stack>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            mt: 0.75,
            mb: 0.5,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2rem" },
            wordBreak: "break-word",
          }}
        >
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
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", sm: "flex-end" },
        justifyContent: "space-between",
        gap: { xs: 1.25, sm: 2 },
        mb: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing="-0.03em"
          sx={{ fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" } }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            "& > *": { flex: { xs: "1 1 auto", sm: "0 0 auto" } },
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
