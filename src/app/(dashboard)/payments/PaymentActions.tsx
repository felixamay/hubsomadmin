"use client";

import { Button, Stack } from "@mui/material";
import { updatePaymentAction } from "@/application/services/admin-actions";
import type { Payment } from "@/domain/entities";

export function PaymentActions({ payment }: { payment: Payment }) {
  const { id, status } = payment;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {status === "authorized" && (
        <Button size="small" variant="contained"
          sx={{ bgcolor: "#0a3d5c" }}
          onClick={() => updatePaymentAction(id, { status: "captured", capturedAt: new Date().toISOString() })}
        >Capture</Button>
      )}
      {(status === "captured" || status === "authorized") && (
        <Button size="small" variant="outlined" color="error"
          onClick={() => updatePaymentAction(id, { status: "refunded", refundedAt: new Date().toISOString() })}
        >Refund</Button>
      )}
    </Stack>
  );
}
