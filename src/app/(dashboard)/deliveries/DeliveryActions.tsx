"use client";

import { Button, Stack } from "@mui/material";
import { updateDeliveryAction } from "@/application/services/admin-actions";
import type { Delivery } from "@/domain/entities";

interface DeliveryActionsProps {
  delivery: Delivery;
  firstOnlineDriverId?: string;
  firstOnlineDriverName?: string;
}

export function DeliveryActions({ delivery, firstOnlineDriverId, firstOnlineDriverName }: DeliveryActionsProps) {
  const { id, status } = delivery;

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {(status === "queued" || status === "offered") && firstOnlineDriverId && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#00aeef", fontSize: 11 }}
          onClick={() => updateDeliveryAction(id, {
            driverId: firstOnlineDriverId,
            driverName: firstOnlineDriverName,
            status: "accepted",
          })}
        >Reassign</Button>
      )}
      {!["delivered", "cancelled", "failed"].includes(status) && (
        <>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateDeliveryAction(id, { status: "failed" })}
          >Mark Failed</Button>
          <Button size="small" variant="outlined" color="success"
            onClick={() => updateDeliveryAction(id, { status: "delivered" })}
          >Mark Delivered</Button>
        </>
      )}
    </Stack>
  );
}
