"use client";

import { Box } from "@mui/material";
import type { SupportTicket } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatDateTime } from "@/lib/currency";
import { TicketActions } from "./TicketActions";

export function SupportClient({ tickets }: { tickets: SupportTicket[] }) {

  return (
    <Box>
      <PageHeader
        title="Support Tickets"
        subtitle={`${tickets.length} tickets · ${tickets.filter((t) => t.status === "open").length} open`}
      />
      <DataTable
        rows={tickets}
        searchPlaceholder="Search by subject, requester…"
        columns={[
          { key: "subject", label: "Subject", mobile: "title", render: (t) => t.subject.slice(0, 50) },
          { key: "requesterName", label: "Requester", mobile: "subtitle" },
          { key: "audience", label: "Audience" },
          {
            key: "priority",
            label: "Priority",
            render: (t) => <StatusChip status={t.priority} />,
          },
          {
            key: "status",
            label: "Status",
            render: (t) => <StatusChip status={t.status} />,
          },
          {
            key: "assigneeName",
            label: "Assignee",
            render: (t) => t.assigneeName ?? "Unassigned",
          },
          {
            key: "createdAt",
            label: "Created",
            render: (t) => formatDateTime(t.createdAt),
          },
        ]}
        actions={(t) => <TicketActions ticket={t} />}
      />
    </Box>
  );
}
