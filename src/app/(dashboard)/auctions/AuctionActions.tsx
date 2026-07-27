"use client";

import { Button, Stack } from "@mui/material";
import { updateAuctionAction } from "@/application/services/admin-actions";
import type { Auction } from "@/domain/entities";

export function AuctionActions({ auction }: { auction: Auction }) {
  const { id, status, featured, disputeOpen } = auction;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {status === "open" && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateAuctionAction(id, { status: "paused" })}
        >Pause</Button>
      )}
      {status === "paused" && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updateAuctionAction(id, { status: "open" })}
        >Restart</Button>
      )}
      {(status === "open" || status === "paused") && (
        <Button size="small" variant="outlined" color="error"
          onClick={() => updateAuctionAction(id, { status: "cancelled" })}
        >Cancel</Button>
      )}
      {!featured && (
        <Button size="small" variant="outlined"
          sx={{ color: "#f36f21", borderColor: "#f36f21" }}
          onClick={() => updateAuctionAction(id, { featured: true })}
        >Feature</Button>
      )}
      {featured && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateAuctionAction(id, { featured: false })}
        >Unfeature</Button>
      )}
      {disputeOpen && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#0a3d5c" }}
          onClick={() => updateAuctionAction(id, { disputeOpen: false })}
        >Resolve Dispute</Button>
      )}
    </Stack>
  );
}
