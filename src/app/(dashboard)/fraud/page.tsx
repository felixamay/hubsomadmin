import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatDateTime } from "@/lib/currency";
import { FraudActions } from "./FraudActions";

export default function FraudPage() {
  const cases = adminStore.getFraudCases();

  return (
    <Box>
      <PageHeader
        title="Fraud Detection"
        subtitle={`${cases.length} cases · ${cases.filter((c) => c.status === "open").length} open · ${cases.filter((c) => c.status === "confirmed").length} confirmed`}
      />
      <DataTable
        rows={cases}
        searchPlaceholder="Search by title, subject…"
        columns={[
          { key: "title", label: "Title" },
          { key: "type", label: "Type", render: (c) => c.type.replaceAll("_", " ") },
          { key: "subjectType", label: "Subject Type" },
          { key: "subjectName", label: "Subject" },
          {
            key: "severity",
            label: "Severity",
            render: (c) => <StatusChip status={c.severity} />,
          },
          {
            key: "status",
            label: "Status",
            render: (c) => <StatusChip status={c.status} />,
          },
          {
            key: "evidence",
            label: "Evidence",
            render: (c) => c.evidence.slice(0, 50) + (c.evidence.length > 50 ? "…" : ""),
          },
          {
            key: "createdAt",
            label: "Detected",
            render: (c) => formatDateTime(c.createdAt),
          },
        ]}
        actions={(c) => <FraudActions fraudCase={c} />}
      />
    </Box>
  );
}
