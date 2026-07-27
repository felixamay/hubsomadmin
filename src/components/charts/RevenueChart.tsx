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

const DATA = [
  { day: "Mon", revenue: 4200, orders: 48 },
  { day: "Tue", revenue: 5100, orders: 61 },
  { day: "Wed", revenue: 4700, orders: 55 },
  { day: "Thu", revenue: 6300, orders: 72 },
  { day: "Fri", revenue: 7800, orders: 91 },
  { day: "Sat", revenue: 9200, orders: 110 },
  { day: "Sun", revenue: 8600, orders: 98 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={DATA}>
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
