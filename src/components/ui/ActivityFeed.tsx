"use client";

import { Paper, Typography, Stack, Box } from "@mui/material";
import type { AuditLogEntry } from "@/domain/entities";
import { formatDateTime } from "@/lib/currency";

export function ActivityFeed({ items }: { items: AuditLogEntry[] }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
      <Typography variant="h6" fontWeight={750} sx={{ mb: 1.5 }}>
        Recent admin activity
      </Typography>
      <Stack spacing={1.25}>
        {items.map((item) => (
          <Box key={item.id}>
            <Typography variant="body2" fontWeight={700}>
              {item.actorName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.action} · {item.entityType}/{item.entityId}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              {formatDateTime(item.createdAt)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
