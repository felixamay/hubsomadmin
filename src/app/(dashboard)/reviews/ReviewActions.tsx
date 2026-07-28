"use client";

import { useState } from "react";
import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { updateReviewAction } from "@/application/services/admin-actions";
import type { Review } from "@/domain/entities";

export function ReviewActions({ review }: { review: Review }) {
  const { id, status } = review;
  const [respondOpen, setRespondOpen] = useState(false);
  const [response, setResponse] = useState("");

  return (
    <>
      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
        {status === "visible" && (
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updateReviewAction(id, { status: "hidden" })}
          >Hide</Button>
        )}
        {status === "hidden" && (
          <Button size="small" variant="outlined" color="success"
            onClick={() => updateReviewAction(id, { status: "visible" })}
          >Unhide</Button>
        )}
        {status !== "deleted" && (
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateReviewAction(id, { status: "deleted" })}
          >Delete</Button>
        )}
        <Button size="small" variant="outlined"
          sx={{ color: "#0a3d5c", borderColor: "#0a3d5c" }}
          onClick={() => setRespondOpen(true)}
        >Respond</Button>
      </Stack>

      <Dialog open={respondOpen} onClose={() => setRespondOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Admin Response</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRespondOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: "#0a3d5c" }}
            onClick={() => {
              updateReviewAction(id, { adminResponse: response });
              setRespondOpen(false);
              setResponse("");
            }}
          >Save Response</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
