"use client";

import { Button, Stack } from "@mui/material";
import { updateTicketAction } from "@/application/services/admin-actions";
import type { SupportTicket } from "@/domain/entities";

export function TicketActions({ ticket }: { ticket: SupportTicket }) {
  const { id, status } = ticket;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {status === "open" && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#0a3d5c" }}
          onClick={() => updateTicketAction(id, { status: "in_progress", assigneeId: "admin_super", assigneeName: "Admin" })}
        >Assign</Button>
      )}
      {(status === "open" || status === "in_progress" || status === "waiting") && (
        <>
          <Button size="small" variant="outlined"
            sx={{ color: "#f7941d", borderColor: "#f7941d" }}
            onClick={() => updateTicketAction(id, { status: "escalated" })}
          >Escalate</Button>
          <Button size="small" variant="outlined" color="success"
            onClick={() => updateTicketAction(id, { status: "resolved", resolvedAt: new Date().toISOString() })}
          >Resolve</Button>
        </>
      )}
      {status === "escalated" && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#00aeef" }}
          onClick={() => updateTicketAction(id, { status: "in_progress" })}
        >Take Over</Button>
      )}
      {status === "resolved" && (
        <Button size="small" variant="outlined"
          onClick={() => updateTicketAction(id, { status: "closed" })}
        >Close</Button>
      )}
    </Stack>
  );
}
