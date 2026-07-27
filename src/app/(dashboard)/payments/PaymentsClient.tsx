"use client";

import { Box } from "@mui/material";
import type { Payment } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { PaymentActions } from "./PaymentActions";

export function PaymentsClient({ payments }: { payments: Payment[] }) {

  return (
    <Box>
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} payment transactions`}
      />
      <DataTable
        rows={payments}
        searchPlaceholder="Search by reference, customer, order…"
        columns={[
          { key: "reference", label: "Reference", mobile: "title" },
          { key: "customerName", label: "Customer", mobile: "subtitle" },
          { key: "orderId", label: "Order ID" },
          { key: "method", label: "Method" },
          {
            key: "amountGhs",
            label: "Amount",
            render: (p) => formatGhs(p.amountGhs),
          },
          {
            key: "processorFeeGhs",
            label: "Proc Fee",
            render: (p) => formatGhs(p.processorFeeGhs),
          },
          {
            key: "netAmountGhs",
            label: "Net",
            render: (p) => formatGhs(p.netAmountGhs),
          },
          {
            key: "status",
            label: "Status",
            render: (p) => <StatusChip status={p.status} />,
          },
          {
            key: "createdAt",
            label: "Date",
            render: (p) => formatDateTime(p.createdAt),
          },
        ]}
        actions={(p) => <PaymentActions payment={p} />}
      />
    </Box>
  );
}
