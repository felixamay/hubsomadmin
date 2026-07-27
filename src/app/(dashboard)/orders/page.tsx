import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { OrderActions } from "./OrderActions";

export default function OrdersPage() {
  const orders = adminStore.getOrders();

  return (
    <Box>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
      />
      <DataTable
        rows={orders}
        searchPlaceholder="Search by buyer, city, status…"
        columns={[
          { key: "id", label: "Order ID" },
          { key: "buyerName", label: "Buyer" },
          { key: "buyerEmail", label: "Email" },
          { key: "shippingCity", label: "City" },
          {
            key: "totalGhs",
            label: "Total",
            render: (o) => formatGhs(o.totalGhs),
          },
          {
            key: "platformFeeGhs",
            label: "Platform Fee",
            render: (o) => formatGhs(o.platformFeeGhs),
          },
          {
            key: "status",
            label: "Status",
            render: (o) => <StatusChip status={o.status} />,
          },
          {
            key: "paymentMethods",
            label: "Payment",
            render: (o) => o.paymentMethods.join(", "),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (o) => formatDateTime(o.createdAt),
          },
        ]}
        actions={(o) => <OrderActions order={o} />}
      />
    </Box>
  );
}
