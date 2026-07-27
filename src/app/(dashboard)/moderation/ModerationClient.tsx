"use client";

import { Box } from "@mui/material";
import type { ContentReport } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatDateTime } from "@/lib/currency";
import { ReportActions } from "./ReportActions";

export function ModerationClient({ reports }: { reports: ContentReport[] }) {

  return (
    <Box>
      <PageHeader
        title="Content Moderation"
        subtitle={`${reports.length} reports · ${reports.filter((r) => r.status === "open").length} open`}
      />
      <DataTable
        rows={reports}
        searchPlaceholder="Search by reporter, target, reason…"
        columns={[
          { key: "reporterName", label: "Reporter" },
          { key: "targetType", label: "Target Type" },
          { key: "targetId", label: "Target ID" },
          { key: "reason", label: "Reason" },
          {
            key: "status",
            label: "Status",
            render: (r) => <StatusChip status={r.status} />,
          },
          {
            key: "createdAt",
            label: "Reported",
            render: (r) => formatDateTime(r.createdAt),
          },
          {
            key: "resolvedAt",
            label: "Resolved",
            render: (r) => r.resolvedAt ? formatDateTime(r.resolvedAt) : "—",
          },
        ]}
        actions={(r) => <ReportActions report={r} />}
      />
    </Box>
  );
}
