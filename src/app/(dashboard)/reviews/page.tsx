import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatDateTime } from "@/lib/currency";
import { ReviewActions } from "./ReviewActions";

export default function ReviewsPage() {
  const reviews = adminStore.getReviews();

  return (
    <Box>
      <PageHeader
        title="Reviews"
        subtitle={`${reviews.length} reviews · ${reviews.filter((r) => r.status === "flagged").length} flagged`}
      />
      <DataTable
        rows={reviews}
        searchPlaceholder="Search by author, target, comment…"
        columns={[
          { key: "authorName", label: "Author" },
          { key: "targetType", label: "Type" },
          { key: "targetName", label: "Target" },
          {
            key: "rating",
            label: "Rating",
            render: (r) => `${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}`,
          },
          {
            key: "comment",
            label: "Comment",
            render: (r) => r.comment.slice(0, 60) + (r.comment.length > 60 ? "…" : ""),
          },
          {
            key: "status",
            label: "Status",
            render: (r) => <StatusChip status={r.status} />,
          },
          {
            key: "createdAt",
            label: "Date",
            render: (r) => formatDateTime(r.createdAt),
          },
        ]}
        actions={(r) => <ReviewActions review={r} />}
      />
    </Box>
  );
}
