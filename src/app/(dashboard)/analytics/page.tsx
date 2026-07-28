import { Box, Grid } from "@mui/material";
import { PageHeader, StatCard } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatGhs } from "@/lib/currency";
import { AnalyticsCharts } from "./AnalyticsCharts";

function buildAnalyticsData() {
  const orders = adminStore.getOrders();
  const payouts = adminStore.getPayouts();
  const sellers = adminStore.getSellers();
  const drivers = adminStore.getDrivers();
  const deliveries = adminStore.getDeliveries();
  const users = adminStore.getUsers();

  const revenueByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" });
    const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === d.toDateString());
    return {
      day: dayStr,
      revenue: dayOrders.reduce((s, o) => s + o.totalGhs, 0),
      orders: dayOrders.length,
    };
  });

  const topSellers = [...sellers]
    .sort((a, b) => b.revenueGhs - a.revenueGhs)
    .slice(0, 6)
    .map((s) => ({ name: s.name.slice(0, 18), revenue: s.revenueGhs }));

  const driverDeliveryCount = new Map<string, number>();
  deliveries.forEach((d) => {
    if (d.driverId) driverDeliveryCount.set(d.driverId, (driverDeliveryCount.get(d.driverId) ?? 0) + 1);
  });
  const topDrivers = [...drivers]
    .sort((a, b) => (driverDeliveryCount.get(b.id) ?? 0) - (driverDeliveryCount.get(a.id) ?? 0))
    .slice(0, 6)
    .map((d) => ({
      name: `${d.fullName.split(" ")[0]} ${(d.fullName.split(" ")[1]?.[0] ?? "")}.`,
      deliveries: driverDeliveryCount.get(d.id) ?? 0,
      earnings: d.lifetimeEarningsGhs,
    }));

  const statusMap = new Map<string, number>();
  orders.forEach((o) => statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1));
  const ordersByStatus = [...statusMap.entries()].map(([status, count]) => ({ status, count }));

  const userGrowth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = d.toLocaleDateString("en-GH", { month: "short", year: "2-digit" });
    const cutoff = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString();
    return {
      month: monthStr,
      users: users.filter((u) => u.createdAt <= cutoff).length,
      sellers: sellers.filter((s) => s.createdAt <= cutoff).length,
      drivers: drivers.filter((d2) => d2.createdAt <= cutoff).length,
    };
  });

  const methodMap = new Map<string, number>();
  payouts.forEach((p) => methodMap.set(p.method, (methodMap.get(p.method) ?? 0) + p.amountGhs));
  const payoutsByMethod = [...methodMap.entries()].map(([method, value]) => ({ method, value }));

  return { revenueByDay, topSellers, topDrivers, ordersByStatus, userGrowth, payoutsByMethod };
}

export default function AnalyticsPage() {
  const stats = adminStore.getStats();
  const data = buildAnalyticsData();
  const weekRevenue = data.revenueByDay.reduce((s, d) => s + d.revenue, 0);

  return (
    <Box>
      <PageHeader
        title="Analytics"
        subtitle="Platform performance — revenue, growth, and operations"
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="7-Day Revenue" value={formatGhs(weekRevenue)} accent="#0a3d5c" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Platform Revenue" value={formatGhs(stats.platformRevenueGhs)} accent="#7cbf2c" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Pending Payouts" value={formatGhs(stats.pendingPayoutsGhs)} accent="#f7941d" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="7-Day Orders" value={data.revenueByDay.reduce((s, d) => s + d.orders, 0)} accent="#00aeef" />
        </Grid>
      </Grid>

      <AnalyticsCharts data={data} />
    </Box>
  );
}
