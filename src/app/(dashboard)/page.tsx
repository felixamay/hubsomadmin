import { Grid, Paper, Typography, Box, Stack, Chip } from "@mui/material";
import { PageHeader, StatCard } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatGhs, formatNumber } from "@/lib/currency";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { ActivityFeed } from "@/components/ui/ActivityFeed";

export default function DashboardPage() {
  const stats = adminStore.getStats();
  const orders = adminStore.getOrders();
  const streams = adminStore.getStreams().filter((s) => s.status === "live");
  const deliveries = adminStore.getDeliveries().filter((d) =>
    ["en_route_to_customer", "picked_up", "accepted", "en_route_to_pickup"].includes(d.status),
  );
  const audit = adminStore.getAuditLogs().slice(0, 6);

  const revenueSeries = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === d.toDateString(),
    );
    return {
      day: d.toLocaleDateString("en-GH", { weekday: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.totalGhs, 0),
      orders: dayOrders.length,
    };
  });

  const cards = [
    { label: "Total Users", value: formatNumber(stats.totalUsers), accent: "#0a3d5c" },
    { label: "Total Sellers", value: formatNumber(stats.totalSellers), accent: "#0054a6" },
    { label: "Total Drivers", value: formatNumber(stats.totalDrivers), accent: "#00aeef" },
    { label: "Verified Sellers", value: formatNumber(stats.verifiedSellers), accent: "#7cbf2c" },
    { label: "Verified Drivers", value: formatNumber(stats.verifiedDrivers), accent: "#7cbf2c" },
    { label: "Pending Driver Verifications", value: formatNumber(stats.pendingDriverVerifications), accent: "#f7941d" },
    { label: "Pending Seller Verifications", value: formatNumber(stats.pendingSellerVerifications), accent: "#f7941d" },
    { label: "Active Live Streams", value: formatNumber(stats.activeLiveStreams), accent: "#f36f21", hint: "Live now" },
    { label: "Active Auctions", value: formatNumber(stats.activeAuctions), accent: "#f36f21" },
    { label: "Orders Today", value: formatNumber(stats.ordersToday), accent: "#0a3d5c" },
    { label: "Deliveries Today", value: formatNumber(stats.deliveriesToday), accent: "#00aeef" },
    { label: "Revenue Today", value: formatGhs(stats.revenueTodayGhs), accent: "#7cbf2c" },
    { label: "Platform Revenue", value: formatGhs(stats.platformRevenueGhs), accent: "#7cbf2c" },
    { label: "Pending Payouts", value: formatGhs(stats.pendingPayoutsGhs), accent: "#f7941d" },
    { label: "Cancelled Orders", value: formatNumber(stats.cancelledOrders), accent: "#d32f2f" },
    { label: "Refund Requests", value: formatNumber(stats.refundRequests), accent: "#d32f2f" },
    { label: "Support Tickets", value: formatNumber(stats.supportTickets), accent: "#f36f21", hint: "Open queue" },
  ];

  return (
    <Box>
      <PageHeader
        title="Operations Dashboard"
        subtitle="Real-time control center for Hubsom Marketplace and Huber Delivery"
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <StatCard label={c.label} value={c.value} accent={c.accent} hint={c.hint} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)", height: "100%" }}>
            <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
              Revenue & orders (7 days)
            </Typography>
            <RevenueChart data={revenueSeries} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2}>
            <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
              <Typography variant="h6" fontWeight={750} sx={{ mb: 1.5 }}>
                Live now
              </Typography>
              <Stack spacing={1}>
                {streams.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No active streams</Typography>
                )}
                {streams.map((s) => (
                  <Box key={s.id} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{s.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.sellerName}</Typography>
                    </Box>
                    <Chip size="small" color="error" label={`${s.viewerCount} watching`} />
                  </Box>
                ))}
              </Stack>
            </Paper>
            <Paper elevation={0} sx={{ p: 2.5, border: "1px solid rgba(10,61,92,0.08)" }}>
              <Typography variant="h6" fontWeight={750} sx={{ mb: 1.5 }}>
                Active deliveries
              </Typography>
              <Stack spacing={1}>
                {deliveries.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No active deliveries</Typography>
                )}
                {deliveries.slice(0, 5).map((d) => (
                  <Box key={d.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight={650}>{d.driverName ?? "Unassigned"}</Typography>
                    <Chip size="small" label={d.status.replaceAll("_", " ")} />
                  </Box>
                ))}
              </Stack>
            </Paper>
            <ActivityFeed items={audit} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
