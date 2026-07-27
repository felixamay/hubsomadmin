"use client";

import { Button, Stack } from "@mui/material";
import { updateSellerAction } from "@/application/services/admin-actions";
import type { Seller } from "@/domain/entities";

export function SellerActions({ seller }: { seller: Seller }) {
  const { id, status, verified } = seller;

  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {status === "pending" && (
        <>
          <Button size="small" variant="contained" color="success"
            sx={{ bgcolor: "#7cbf2c" }}
            onClick={() => updateSellerAction(id, { status: "approved" })}
          >Approve</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateSellerAction(id, { status: "rejected" })}
          >Reject</Button>
        </>
      )}
      {status === "approved" && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateSellerAction(id, { status: "suspended" })}
        >Suspend</Button>
      )}
      {(status === "suspended" || status === "rejected") && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updateSellerAction(id, { status: "approved" })}
        >Restore</Button>
      )}
      {status === "approved" && (
        <Button size="small" variant="outlined" color="error"
          onClick={() => updateSellerAction(id, { status: "banned" })}
        >Ban</Button>
      )}
      {status === "banned" && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updateSellerAction(id, { status: "approved" })}
        >Unban</Button>
      )}
      {status === "approved" && !verified && (
        <Button size="small" variant="outlined"
          sx={{ color: "#0a3d5c", borderColor: "#0a3d5c" }}
          onClick={() => updateSellerAction(id, { verified: true })}
        >Verify</Button>
      )}
      {verified && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateSellerAction(id, { verified: false })}
        >Unverify</Button>
      )}
    </Stack>
  );
}
