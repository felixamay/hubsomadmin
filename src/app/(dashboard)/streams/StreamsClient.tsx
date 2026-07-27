"use client";

import { Box } from "@mui/material";
import type { LiveStream } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatDateTime } from "@/lib/currency";
import { StreamActions } from "./StreamActions";

export function StreamsClient({ streams }: { streams: LiveStream[] }) {

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
          { key: "title", label: "Title", mobile: "title" },
          { key: "sellerName", label: "Seller", mobile: "subtitle" },
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
