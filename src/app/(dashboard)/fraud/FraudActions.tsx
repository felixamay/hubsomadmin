"use client";

import { Button, Stack } from "@mui/material";
import { updateFraudAction } from "@/application/services/admin-actions";
import type { FraudCase } from "@/domain/entities";

export function FraudActions({ fraudCase }: { fraudCase: FraudCase }) {
  const { id, status } = fraudCase;
  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {status === "open" && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#0a3d5c" }}
          onClick={() => updateFraudAction(id, { status: "investigating" })}
        >Investigate</Button>
      )}
      {status === "investigating" && (
        <>
          <Button size="small" variant="contained" color="error"
            onClick={() => updateFraudAction(id, { status: "confirmed" })}
          >Confirm</Button>
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updateFraudAction(id, { status: "dismissed" })}
          >Dismiss</Button>
        </>
      )}
      {status === "confirmed" && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updateFraudAction(id, { status: "resolved" })}
        >Resolve</Button>
      )}
      {(status === "dismissed" || status === "resolved") && (
        <Button size="small" variant="outlined"
          onClick={() => updateFraudAction(id, { status: "open" })}
        >Reopen</Button>
      )}
    </Stack>
  );
}
