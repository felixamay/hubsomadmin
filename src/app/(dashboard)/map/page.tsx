import { Box, Paper, Typography, Stack, Chip } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { MapView } from "./MapView";

export default function MapPage() {
  const drivers = adminStore.getDrivers();
  const deliveries = adminStore.getDeliveries();

  const onlineDrivers = drivers.filter((d) => d.status !== "offline");
  const activeDeliveries = deliveries.filter((d) =>
    ["accepted", "en_route_to_pickup", "picked_up", "en_route_to_customer"].includes(d.status)
  );

  const statusCounts = {
    online: drivers.filter((d) => d.status === "online").length,
    on_delivery: drivers.filter((d) => d.status === "on_delivery").length,
    busy: drivers.filter((d) => d.status === "busy").length,
    offline: drivers.filter((d) => d.status === "offline").length,
  };

  return (
    <Box>
      <PageHeader
        title="Live Map"
        subtitle={`${onlineDrivers.length} active drivers · ${activeDeliveries.length} active deliveries`}
      />

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        sx={{ mb: 2, gap: 1 }}
      >
        {Object.entries(statusCounts).map(([status, count]) => (
          <Paper
            key={status}
            elevation={0}
            sx={{
              px: 1.5,
              py: 1,
              border: "1px solid rgba(10,61,92,0.08)",
              borderRadius: 2,
              flex: { xs: "1 1 calc(50% - 8px)", sm: "0 0 auto" },
              minWidth: { xs: "calc(50% - 8px)", sm: 100 },
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
              {count}
            </Typography>
            <Chip
              size="small"
              label={status.replaceAll("_", " ")}
              sx={{ textTransform: "capitalize", mt: 0.5 }}
              color={status === "online" ? "success" : status === "on_delivery" ? "warning" : "default"}
            />
          </Paper>
        ))}
        <Paper
          elevation={0}
          sx={{
            px: 1.5,
            py: 1,
            border: "1px solid rgba(10,61,92,0.08)",
            borderRadius: 2,
            flex: { xs: "1 1 calc(50% - 8px)", sm: "0 0 auto" },
            minWidth: { xs: "calc(50% - 8px)", sm: 100 },
          }}
        >
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
            {activeDeliveries.length}
          </Typography>
          <Chip size="small" label="active deliveries" sx={{ bgcolor: "#00aeef", color: "#fff", mt: 0.5 }} />
        </Paper>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          border: "1px solid rgba(10,61,92,0.08)",
          borderRadius: 2,
          height: { xs: "min(62dvh, 480px)", sm: 520 },
          minHeight: 280,
        }}
      >
        <MapView drivers={drivers} deliveries={deliveries} />
      </Paper>

      <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ mt: 2, gap: 1.5 }}>
        {[
          { color: "#7cbf2c", label: "Online driver" },
          { color: "#f36f21", label: "On delivery" },
          { color: "#9e9e9e", label: "Offline" },
          { color: "#00aeef", label: "Active delivery pickup" },
        ].map((l) => (
          <Stack key={l.label} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: l.color, flexShrink: 0 }} />
            <Typography variant="caption">{l.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
