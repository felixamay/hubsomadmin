"use client";

import { Box } from "@mui/material";
import type { Delivery } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { DeliveryActions } from "./DeliveryActions";

function pickupLabel(d: Delivery): string {
  const pickup = d.pickup;
  if (!pickup) return "—";
  if (pickup.address) return pickup.address;
  if (typeof pickup.latitude === "number" && typeof pickup.longitude === "number") {
    return `${pickup.latitude.toFixed(3)}, ${pickup.longitude.toFixed(3)}`;
  }
  return "—";
}

export function DeliveriesClient({
  deliveries,
  firstOnlineDriverId,
  firstOnlineDriverName,
}: {
  deliveries: Delivery[];
  firstOnlineDriverId?: string;
  firstOnlineDriverName?: string;
}) {
  const rows = Array.isArray(deliveries) ? deliveries : [];

  return (
    <Box>
      <PageHeader
        title="Deliveries"
        subtitle={`${rows.length} delivery record${rows.length === 1 ? "" : "s"}`}
      />
      <DataTable
        rows={rows}
        searchPlaceholder="Search by driver, customer…"
        emptyMessage="No deliveries yet. Huber delivery activity will appear here."
        columns={[
          { key: "id", label: "Delivery ID", mobile: "title" },
          {
            key: "driverName",
            label: "Driver",
            render: (d) => d.driverName ?? "Unassigned",
          },
          { key: "customerName", label: "Customer", mobile: "subtitle" },
          { key: "sellerName", label: "Seller" },
          {
            key: "status",
            label: "Status",
            render: (d) => <StatusChip status={d.status ?? "queued"} />,
          },
          {
            key: "feeGhs",
            label: "Fee",
            render: (d) => formatGhs(Number(d.feeGhs) || 0),
          },
          {
            key: "tipGhs",
            label: "Tip",
            render: (d) => formatGhs(Number(d.tipGhs) || 0),
          },
          {
            key: "etaMinutes",
            label: "ETA (min)",
            render: (d) => (d.etaMinutes != null ? String(d.etaMinutes) : "—"),
          },
          {
            key: "pickup",
            label: "Pickup",
            render: (d) => pickupLabel(d),
            searchValue: (d) => pickupLabel(d),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (d) => (d.createdAt ? formatDateTime(d.createdAt) : "—"),
          },
        ]}
        actions={(d) => (
          <DeliveryActions
            delivery={d}
            firstOnlineDriverId={firstOnlineDriverId}
            firstOnlineDriverName={firstOnlineDriverName}
          />
        )}
      />
    </Box>
  );
}
