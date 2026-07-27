"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { PayoutActions } from "./PayoutActions";
import type { Payout } from "@/domain/entities";

export function PayoutsClient({ payouts }: { payouts: Payout[] }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? payouts : payouts.filter((p) => p.recipientType === tab);

  return (
    <Box>
      <PageHeader
        title="Payouts"
        subtitle={`${payouts.length} total payout records`}
      />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="All" value="all" />
          <Tab label="Sellers" value="seller" />
          <Tab label="Drivers" value="driver" />
        </Tabs>
      </Box>
      <DataTable
        rows={filtered}
        searchPlaceholder="Search by name, method…"
        columns={[
          { key: "recipientName", label: "Recipient", mobile: "title" },
          { key: "recipientType", label: "Type", mobile: "subtitle" },
          { key: "method", label: "Method" },
          { key: "accountDetails", label: "Account" },
          {
            key: "amountGhs",
            label: "Amount",
            render: (p) => formatGhs(p.amountGhs),
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
        actions={(p) => <PayoutActions payout={p} />}
      />
    </Box>
  );
}
