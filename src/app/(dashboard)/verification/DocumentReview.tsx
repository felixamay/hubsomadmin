"use client";

import { useState } from "react";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { reviewDocumentAction } from "@/application/services/admin-actions";
import type { Driver } from "@/domain/entities";

export function DocumentReview({ driver }: { driver: Driver }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const pending = driver.documents.filter((d) => d.status === "pending");

  function docColor(status: string) {
    if (status === "approved") return "success";
    if (status === "rejected" || status === "more_docs_required") return "error";
    return "warning";
  }

  async function handleAction(
    docId: string,
    status: Driver["documents"][number]["status"],
  ) {
    await reviewDocumentAction(driver.id, docId, status, notes || undefined);
    setOpen(false);
    setNotes("");
    setSelectedDocId(null);
  }

  return (
    <>
      <Box
        sx={{
          border: "1px solid rgba(10,61,92,0.1)",
          borderRadius: 2,
          p: { xs: 1.5, sm: 2 },
          mb: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          spacing={1}
          mb={1}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={750}>
              {driver.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-word" }}>
              {driver.email} · {driver.vehicleType} · {driver.city}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={driver.verificationStatus.replaceAll("_", " ")}
            color={
              driver.verificationStatus === "approved"
                ? "success"
                : driver.verificationStatus === "rejected"
                  ? "error"
                  : "warning"
            }
            sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
          />
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mt={1}>
          {driver.documents.map((doc) => (
            <Chip
              key={doc.id}
              size="small"
              label={doc.type.replaceAll("_", " ")}
              color={docColor(doc.status) as "success" | "error" | "warning"}
              variant={doc.status === "pending" ? "filled" : "outlined"}
              onClick={() => {
                setSelectedDocId(doc.id);
                setOpen(true);
              }}
              sx={{ cursor: "pointer", textTransform: "capitalize" }}
            />
          ))}
        </Stack>

        {pending.length > 0 && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mt={1.5}>
            {pending.map((doc) => (
              <Stack key={doc.id} direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ width: { xs: "100%", sm: "auto" } }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  sx={{ bgcolor: "#7cbf2c", fontSize: 11, flex: { xs: 1, sm: "none" } }}
                  onClick={() => reviewDocumentAction(driver.id, doc.id, "approved")}
                >
                  ✓ {doc.type.replaceAll("_", " ")}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{ fontSize: 11, flex: { xs: 1, sm: "none" } }}
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setOpen(true);
                  }}
                >
                  Review
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogTitle>Review Document</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
              alignItems: { xs: "stretch", sm: "flex-start" },
            }}
          >
            <Stack direction="row" spacing={1.5} justifyContent="center">
              <Box
                component="img"
                src="/brand/doc-id.svg"
                alt="Document"
                sx={{ width: { xs: "45%", sm: 120 }, maxWidth: 160, height: "auto", borderRadius: 1, objectFit: "cover" }}
              />
              <Box
                component="img"
                src="/brand/doc-selfie.svg"
                alt="Selfie"
                sx={{ width: { xs: "45%", sm: 80 }, maxWidth: 120, height: "auto", borderRadius: 1, objectFit: "cover" }}
              />
            </Stack>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                {driver.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Document ID: {selectedDocId}
              </Typography>
            </Box>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Review notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for rejection or additional requirements…"
          />
        </DialogContent>
        <DialogActions
          sx={{
            px: 2,
            pb: "calc(16px + var(--safe-bottom))",
            flexWrap: "wrap",
            gap: 1,
            "& .MuiButton-root": { flex: { xs: "1 1 calc(50% - 8px)", sm: "0 0 auto" } },
          }}
        >
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="outlined"
            sx={{ color: "#f7941d", borderColor: "#f7941d" }}
            onClick={() => selectedDocId && handleAction(selectedDocId, "more_docs_required")}
          >
            More Docs
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => selectedDocId && handleAction(selectedDocId, "rejected")}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ bgcolor: "#7cbf2c" }}
            onClick={() => selectedDocId && handleAction(selectedDocId, "approved")}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
