import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { AuctionActions } from "./AuctionActions";

export default function AuctionsPage() {
  const auctions = adminStore.getAuctions();

  return (
    <Box>
      <PageHeader
        title="Auctions"
        subtitle={`${auctions.length} auctions · ${auctions.filter((a) => a.status === "open").length} open`}
      />
      <DataTable
        rows={auctions}
        searchPlaceholder="Search by product, seller…"
        columns={[
          { key: "productName", label: "Product" },
          { key: "sellerName", label: "Seller" },
          {
            key: "startingBidGhs",
            label: "Start Bid",
            render: (a) => formatGhs(a.startingBidGhs),
          },
          {
            key: "currentBidGhs",
            label: "Current Bid",
            render: (a) => formatGhs(a.currentBidGhs),
          },
          { key: "bidderCount", label: "Bidders" },
          {
            key: "status",
            label: "Status",
            render: (a) => <StatusChip status={a.status} />,
          },
          {
            key: "featured",
            label: "Featured",
            render: (a) => <StatusChip status={a.featured ? "featured" : "standard"} />,
          },
          {
            key: "disputeOpen",
            label: "Dispute",
            render: (a) => a.disputeOpen ? <StatusChip status="disputed" /> : "—",
          },
          {
            key: "endsAt",
            label: "Ends At",
            render: (a) => formatDateTime(a.endsAt),
          },
        ]}
        actions={(a) => <AuctionActions auction={a} />}
      />
    </Box>
  );
}
