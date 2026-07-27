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
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { statusColor } from "@/lib/utils";
import { useMemo, useState } from "react";

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  searchValue?: (row: T) => string;
  /** Prefer showing this field in the mobile card body */
  mobile?: boolean | "title" | "subtitle";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const titleCol = columns.find((c) => c.mobile === "title") ?? columns[0];
  const subtitleCol = columns.find((c) => c.mobile === "subtitle");
  const bodyCols = columns.filter((c) => {
    if (c === titleCol || c === subtitleCol) return false;
    if (c.mobile === false) return false;
    if (c.mobile === true) return true;
    // default: include status-like and first few columns
    return (
      c.key.toLowerCase().includes("status") ||
      c.key.toLowerCase().includes("verification") ||
      columns.indexOf(c) < 4
    );
  }).slice(0, 6);

  function cellValue(col: Column<T>, row: T) {
    return col.render
      ? col.render(row)
      : String((row as Record<string, unknown>)[col.key] ?? "—");
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid rgba(10,61,92,0.08)",
        overflow: "hidden",
        borderRadius: { xs: 2, md: 2 },
      }}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(10,61,92,0.06)" }}>
        <TextField
          size="small"
          fullWidth
          placeholder={searchPlaceholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          inputProps={{ enterKeyHint: "search" }}
        />
      </Box>

      {isMobile ? (
        <Box sx={{ p: { xs: 1.25, sm: 1.5 } }}>
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              {emptyMessage}
            </Typography>
          )}
          <Stack spacing={1.25}>
            {filtered.map((row) => (
              <Paper
                key={row.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  border: "1px solid rgba(10,61,92,0.08)",
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.9)",
                }}
              >
                <Typography variant="subtitle2" fontWeight={750} sx={{ mb: 0.25, wordBreak: "break-word" }}>
                  {cellValue(titleCol, row)}
                </Typography>
                {subtitleCol && (
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {cellValue(subtitleCol, row)}
                  </Typography>
                )}
                <Stack spacing={0.75} sx={{ mb: actions ? 1.25 : 0 }}>
                  {bodyCols.map((c) => (
                    <Box
                      key={c.key}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, pt: 0.25 }}>
                        {c.label}
                      </Typography>
                      <Box sx={{ textAlign: "right", minWidth: 0, "& *": { maxWidth: "100%" } }}>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                          {cellValue(c, row)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
                {actions && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Stack
                      direction="row"
                      spacing={0.75}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ "& .MuiButton-root": { flexGrow: 1, minWidth: "calc(50% - 6px)" } }}
                    >
                      {actions(row)}
                    </Stack>
                  </>
                )}
              </Paper>
            ))}
          </Stack>
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 640, overflowX: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.key} sx={{ fontWeight: 750, bgcolor: "#f5fbfe", whiteSpace: "nowrap" }}>
                    {c.label}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe", whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
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
                    <TableCell key={c.key}>{cellValue(c, row)}</TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {actions(row)}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
      sx={{ textTransform: "capitalize", fontWeight: 650, maxWidth: "100%" }}
    />
  );
}
