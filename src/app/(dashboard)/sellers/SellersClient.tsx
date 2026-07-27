"use client";

import { Box } from "@mui/material";
import type { Seller } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { SellerActions } from "./SellerActions";

export function SellersClient({ sellers }: { sellers: Seller[] }) {

  return (
    <Box>
      <PageHeader
        title="Sellers"
        subtitle={`${sellers.length} registered seller accounts`}
      />
      <DataTable
        rows={sellers}
        searchPlaceholder="Search by name, city, email…"
        columns={[
          { key: "name", label: "Store Name" },
          { key: "ownerName", label: "Owner" },
          { key: "ownerEmail", label: "Email" },
          { key: "city", label: "City" },
          {
            key: "status",
            label: "Status",
            render: (s) => <StatusChip status={s.status} />,
          },
          {
            key: "verified",
            label: "Verified",
            render: (s) => <StatusChip status={s.verified ? "verified" : "unverified"} />,
          },
          { key: "productCount", label: "Products" },
          {
            key: "revenueGhs",
            label: "Revenue",
            render: (s) => formatGhs(s.revenueGhs),
          },
          {
            key: "rating",
            label: "Rating",
            render: (s) => `${s.rating.toFixed(1)} ★`,
          },
          {
            key: "createdAt",
            label: "Joined",
            render: (s) => formatDateTime(s.createdAt),
          },
        ]}
        actions={(s) => <SellerActions seller={s} />}
      />
    </Box>
  );
}
