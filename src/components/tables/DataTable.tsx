"use client";

import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { statusColor } from "@/lib/utils";
import { useMemo, useState } from "react";

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  searchValue?: (row: T) => string;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchPlaceholder = "Search…",
  emptyMessage = "No records found",
  actions,
}: {
  rows: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      columns.some((col) => {
        const raw = col.searchValue
          ? col.searchValue(row)
          : String((row as Record<string, unknown>)[col.key] ?? "");
        return raw.toLowerCase().includes(query);
      }),
    );
  }, [rows, columns, q]);

  return (
    <Paper elevation={0} sx={{ border: "1px solid rgba(10,61,92,0.08)", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(10,61,92,0.06)" }}>
        <TextField
          size="small"
          fullWidth
          placeholder={searchPlaceholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Box>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.key} sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>
                  {c.label}
                </TableCell>
              ))}
              {actions && (
                <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render
                      ? c.render(row)
                      : String((row as Record<string, unknown>)[c.key] ?? "—")}
                  </TableCell>
                ))}
                {actions && <TableCell><Stack direction="row" spacing={1} flexWrap="wrap">{actions(row)}</Stack></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ px: 2, py: 1.25, borderTop: "1px solid rgba(10,61,92,0.06)" }}>
        <Typography variant="caption" color="text.secondary">
          Showing {filtered.length} of {rows.length}
        </Typography>
      </Box>
    </Paper>
  );
}

export function StatusChip({ status }: { status: string }) {
  const color = statusColor(status);
  return (
    <Chip
      size="small"
      label={status.replaceAll("_", " ")}
      color={color === "default" ? undefined : color}
      variant={color === "default" ? "outlined" : "filled"}
      sx={{ textTransform: "capitalize", fontWeight: 650 }}
    />
  );
}
