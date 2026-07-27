"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Typography } from "@mui/material";

export type RevenuePoint = { day: string; revenue: number; orders: number };

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  if (!data.length || data.every((d) => d.revenue === 0 && d.orders === 0)) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
        No revenue yet — charts will populate as orders are captured.
      </Typography>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00aeef" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#00aeef" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,61,92,0.08)" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [
            name === "revenue" ? `GHS ${Number(value).toLocaleString()}` : value,
            name === "revenue" ? "Revenue" : "Orders",
          ]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#0a3d5c" fill="url(#rev)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
