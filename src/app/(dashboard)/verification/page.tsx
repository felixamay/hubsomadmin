import { Box, Typography, Chip, Stack, Paper } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { DocumentReview } from "./DocumentReview";

export default function VerificationPage() {
  const drivers = adminStore.getDrivers();
  const pendingDrivers = drivers.filter((d) =>
    d.verificationStatus === "pending" ||
    d.verificationStatus === "more_docs_required" ||
    d.documents.some((doc) => doc.status === "pending")
  );
  const allPendingDocs = drivers.flatMap((d) =>
    d.documents.filter((doc) => doc.status === "pending")
  );

  return (
    <Box>
      <PageHeader
        title="Document Verification"
        subtitle={`${pendingDrivers.length} drivers pending · ${allPendingDocs.length} documents to review`}
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        {(["pending", "approved", "rejected", "more_docs_required"] as const).map((s) => {
          const count = drivers.filter((d) => d.verificationStatus === s).length;
          return (
            <Paper key={s} elevation={0}
              sx={{ px: 2.5, py: 1.5, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2, minWidth: 120, textAlign: "center" }}
            >
              <Typography variant="h5" fontWeight={800}>{count}</Typography>
              <Chip size="small" label={s.replaceAll("_", " ")}
                color={s === "approved" ? "success" : s === "rejected" ? "error" : "warning"}
                sx={{ mt: 0.5, textTransform: "capitalize" }}
              />
            </Paper>
          );
        })}
      </Stack>

      {pendingDrivers.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid rgba(10,61,92,0.08)" }}>
          <Typography color="text.secondary">No pending verifications</Typography>
        </Paper>
      ) : (
        <Box>
          {pendingDrivers.map((driver) => (
            <DocumentReview key={driver.id} driver={driver} />
          ))}
        </Box>
      )}
    </Box>
  );
}
