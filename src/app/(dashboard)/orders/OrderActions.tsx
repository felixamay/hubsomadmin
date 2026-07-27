"use client";

import { Button, Stack } from "@mui/material";
import { updateOrderAction } from "@/application/services/admin-actions";
import type { Order } from "@/domain/entities";

export function OrderActions({ order }: { order: Order }) {
  const { id, status } = order;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {(status === "pending_payment" || status === "paid") && (
        <Button size="small" variant="outlined" color="error"
          onClick={() => updateOrderAction(id, { status: "cancelled" })}
        >Cancel</Button>
      )}
      {status === "paid" && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateOrderAction(id, { status: "refunded" })}
        >Refund</Button>
      )}
      {status === "paid" && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#7cbf2c" }}
          onClick={() => updateOrderAction(id, { status: "fulfilled" })}
        >Force Complete</Button>
      )}
    </Stack>
  );
}
