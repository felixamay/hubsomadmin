import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { DriverActions } from "./DriverActions";

export default function DriversPage() {
  const drivers = adminStore.getDrivers();

  return (
    <Box>
      <PageHeader
        title="Drivers"
        subtitle={`${drivers.length} registered drivers`}
      />
      <DataTable
        rows={drivers}
        searchPlaceholder="Search by name, city, vehicle…"
        columns={[
          { key: "fullName", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "city", label: "City" },
          { key: "vehicleType", label: "Vehicle" },
          { key: "vehiclePlate", label: "Plate", render: (d) => d.vehiclePlate ?? "—" },
          {
            key: "verificationStatus",
            label: "Verification",
            render: (d) => <StatusChip status={d.verificationStatus} />,
          },
          {
            key: "status",
            label: "Status",
            render: (d) => <StatusChip status={d.status} />,
          },
          {
            key: "canGoOnline",
            label: "Can Go Online",
            render: (d) => <StatusChip status={d.canGoOnline ? "approved" : "pending"} />,
          },
          {
            key: "rating",
            label: "Rating",
            render: (d) => `${d.rating.toFixed(1)} ★`,
          },
          {
            key: "walletBalanceGhs",
            label: "Wallet",
            render: (d) => formatGhs(d.walletBalanceGhs),
          },
          {
            key: "createdAt",
            label: "Joined",
            render: (d) => formatDateTime(d.createdAt),
          },
        ]}
        actions={(d) => <DriverActions driver={d} />}
      />
    </Box>
  );
}
