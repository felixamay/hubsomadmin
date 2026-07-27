"use client";

import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { PieLabelRenderProps } from "recharts";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Grid, Typography } from "@mui/material";

const COLORS = ["#0a3d5c", "#00aeef", "#7cbf2c", "#f36f21", "#f7941d"];

interface ChartData {
  revenueByDay: { day: string; revenue: number; orders: number }[];
  topSellers: { name: string; revenue: number }[];
  topDrivers: { name: string; deliveries: number; earnings: number }[];
  ordersByStatus: { status: string; count: number }[];
  userGrowth: { month: string; users: number; sellers: number; drivers: number }[];
  payoutsByMethod: { method: string; value: number }[];
}

function fmtGhs(v: ValueType | undefined): string {
  if (v == null) return "";
  return `GHS ${Number(v).toLocaleString()}`;
}

function fmtNum(v: ValueType | undefined): string {
  if (v == null) return "";
  return String(Number(v));
}

function renderStatusLabel(props: PieLabelRenderProps): string {
  const name = typeof props.name === "string" ? props.name.replace(/_/g, " ") : "";
  const pct = typeof props.percent === "number" ? `${(props.percent * 100).toFixed(0)}%` : "";
  return `${name} ${pct}`;
}

function renderPctLabel(props: PieLabelRenderProps): string {
  return typeof props.percent === "number" ? `${(props.percent * 100).toFixed(0)}%` : "";
}

export function AnalyticsCharts({ data }: { data: ChartData }) {
  return (
    <Grid container spacing={3}>
      {/* Revenue & Orders */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 750, mb: 2 }}>
            Revenue &amp; Orders (Last 7 Days)
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,61,92,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip formatter={fmtGhs} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue (GHS)" fill="#0a3d5c" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#00aeef" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Orders by Status */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 750, mb: 2 }}>
            Orders by Status
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.ordersByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={renderStatusLabel}
                labelLine={false}
              >
                {data.ordersByStatus.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={fmtNum} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Top Sellers */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 750, mb: 2 }}>
            Top Sellers by Revenue
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topSellers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,61,92,0.06)" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: number) => `₵${(v / 1000).toFixed(0)}k`}
              />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={fmtGhs} />
              <Bar dataKey="revenue" fill="#7cbf2c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Top Drivers */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 750, mb: 2 }}>
            Top Drivers by Deliveries
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topDrivers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,61,92,0.06)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={fmtNum} />
              <Bar dataKey="deliveries" fill="#00aeef" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* User Growth */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 750, mb: 2 }}>
            User Growth (Monthly)
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,61,92,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#0a3d5c" strokeWidth={2} dot={false} name="Users" />
              <Line type="monotone" dataKey="sellers" stroke="#7cbf2c" strokeWidth={2} dot={false} name="Sellers" />
              <Line type="monotone" dataKey="drivers" stroke="#00aeef" strokeWidth={2} dot={false} name="Drivers" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Payouts by Method */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 750, mb: 2 }}>
            Payouts by Method
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.payoutsByMethod}
                dataKey="value"
                nameKey="method"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                label={renderPctLabel}
              >
                {data.payoutsByMethod.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={fmtGhs} />
              <Legend formatter={(v: string) => v.replaceAll("_", " ")} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}
