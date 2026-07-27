"use client";

import { Button, Stack } from "@mui/material";
import { updateProductAction } from "@/application/services/admin-actions";
import type { Product } from "@/domain/entities";

export function ProductActions({ product }: { product: Product }) {
  const { id, moderationStatus, featured } = product;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      {moderationStatus === "pending" && (
        <>
          <Button size="small" variant="contained" color="success"
            sx={{ bgcolor: "#7cbf2c" }}
            onClick={() => updateProductAction(id, { moderationStatus: "approved" })}
          >Approve</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateProductAction(id, { moderationStatus: "rejected" })}
          >Reject</Button>
        </>
      )}
      {moderationStatus === "approved" && (
        <>
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updateProductAction(id, { moderationStatus: "flagged" })}
          >Flag</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateProductAction(id, { moderationStatus: "removed" })}
          >Remove</Button>
        </>
      )}
      {(moderationStatus === "flagged") && (
        <>
          <Button size="small" variant="outlined" color="success"
            onClick={() => updateProductAction(id, { moderationStatus: "approved" })}
          >Clear Flag</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateProductAction(id, { moderationStatus: "removed" })}
          >Remove</Button>
        </>
      )}
      {moderationStatus === "approved" && !featured && (
        <Button size="small" variant="outlined"
          sx={{ color: "#f36f21", borderColor: "#f36f21" }}
          onClick={() => updateProductAction(id, { featured: true })}
        >Feature</Button>
      )}
      {featured && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateProductAction(id, { featured: false })}
        >Unfeature</Button>
      )}
    </Stack>
  );
}
