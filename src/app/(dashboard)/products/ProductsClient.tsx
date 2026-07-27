"use client";

import { Box } from "@mui/material";
import type { Product } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { ProductActions } from "./ProductActions";

export function ProductsClient({ products }: { products: Product[] }) {

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products · ${products.filter((p) => p.moderationStatus === "pending").length} pending review`}
      />
      <DataTable
        rows={products}
        searchPlaceholder="Search by name, seller, category…"
        columns={[
          { key: "name", label: "Product" },
          { key: "sellerName", label: "Seller" },
          { key: "category", label: "Category" },
          {
            key: "priceGhs",
            label: "Price",
            render: (p) => formatGhs(p.priceGhs),
          },
          { key: "stock", label: "Stock" },
          {
            key: "moderationStatus",
            label: "Moderation",
            render: (p) => <StatusChip status={p.moderationStatus} />,
          },
          {
            key: "featured",
            label: "Featured",
            render: (p) => <StatusChip status={p.featured ? "featured" : "standard"} />,
          },
          {
            key: "rating",
            label: "Rating",
            render: (p) => `${p.rating.toFixed(1)} ★ (${p.reviewCount})`,
          },
          {
            key: "createdAt",
            label: "Added",
            render: (p) => formatDateTime(p.createdAt),
          },
        ]}
        actions={(p) => <ProductActions product={p} />}
      />
    </Box>
  );
}
