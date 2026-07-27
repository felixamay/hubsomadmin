import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatDateTime } from "@/lib/currency";
import { StreamActions } from "./StreamActions";

export default function StreamsPage() {
  const streams = adminStore.getStreams();

  return (
    <Box>
      <PageHeader
        title="Live Streams"
        subtitle={`${streams.length} streams · ${streams.filter((s) => s.status === "live").length} live now`}
      />
      <DataTable
        rows={streams}
        searchPlaceholder="Search by title, seller…"
        columns={[
          { key: "title", label: "Title" },
          { key: "sellerName", label: "Seller" },
          {
            key: "status",
            label: "Status",
            render: (s) => <StatusChip status={s.status} />,
          },
          { key: "viewerCount", label: "Viewers" },
          { key: "peakViewers", label: "Peak" },
          {
            key: "health",
            label: "Health",
            render: (s) => <StatusChip status={s.health} />,
          },
          {
            key: "featured",
            label: "Featured",
            render: (s) => <StatusChip status={s.featured ? "featured" : "standard"} />,
          },
          {
            key: "startedAt",
            label: "Started",
            render: (s) => s.startedAt ? formatDateTime(s.startedAt) : "—",
          },
        ]}
        actions={(s) => <StreamActions stream={s} />}
      />
    </Box>
  );
}
