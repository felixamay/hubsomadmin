import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { DeliveryActions } from "./DeliveryActions";

export default function DeliveriesPage() {
  const deliveries = adminStore.getDeliveries();
  const drivers = adminStore.getDrivers();
  const onlineDriver = drivers.find((d) => d.status === "online" && d.canGoOnline);

  return (
    <Box>
      <PageHeader
        title="Deliveries"
        subtitle={`${deliveries.length} delivery records`}
      />
      <DataTable
        rows={deliveries}
        searchPlaceholder="Search by driver, customer…"
        columns={[
          { key: "id", label: "Delivery ID" },
          { key: "driverName", label: "Driver", render: (d) => d.driverName ?? "Unassigned" },
          { key: "customerName", label: "Customer" },
          { key: "sellerName", label: "Seller" },
          {
            key: "status",
            label: "Status",
            render: (d) => <StatusChip status={d.status} />,
          },
          {
            key: "feeGhs",
            label: "Fee",
            render: (d) => formatGhs(d.feeGhs),
          },
          {
            key: "tipGhs",
            label: "Tip",
            render: (d) => formatGhs(d.tipGhs),
          },
          {
            key: "etaMinutes",
            label: "ETA (min)",
            render: (d) => d.etaMinutes ?? "—",
          },
          {
            key: "pickup",
            label: "Pickup",
            render: (d) => d.pickup.address ?? `${d.pickup.latitude.toFixed(3)},${d.pickup.longitude.toFixed(3)}`,
          },
          {
            key: "createdAt",
            label: "Date",
            render: (d) => formatDateTime(d.createdAt),
          },
        ]}
        actions={(d) => (
          <DeliveryActions
            delivery={d}
            firstOnlineDriverId={onlineDriver?.id}
            firstOnlineDriverName={onlineDriver?.fullName}
          />
        )}
      />
    </Box>
  );
}
