"use client";

import { Button, Stack, Tabs, Tab, Box } from "@mui/material";
import { updatePayoutAction } from "@/application/services/admin-actions";
import type { Payout } from "@/domain/entities";

export function PayoutActions({ payout }: { payout: Payout }) {
  const { id, status } = payout;
  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {status === "pending" && (
        <>
          <Button size="small" variant="contained" sx={{ bgcolor: "#7cbf2c" }}
            onClick={() => updatePayoutAction(id, { status: "approved" })}
          >Approve</Button>
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updatePayoutAction(id, { status: "held" })}
          >Hold</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updatePayoutAction(id, { status: "rejected" })}
          >Reject</Button>
        </>
      )}
      {status === "approved" && (
        <>
          <Button size="small" variant="contained" sx={{ bgcolor: "#00aeef" }}
            onClick={() => updatePayoutAction(id, { status: "processing" })}
          >Process</Button>
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updatePayoutAction(id, { status: "held" })}
          >Hold</Button>
        </>
      )}
      {status === "held" && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updatePayoutAction(id, { status: "approved" })}
        >Release</Button>
      )}
      {status === "processing" && (
        <Button size="small" variant="contained" sx={{ bgcolor: "#0a3d5c" }}
          onClick={() => updatePayoutAction(id, { status: "completed", processedAt: new Date().toISOString() })}
        >Complete</Button>
      )}
    </Stack>
  );
}

export function PayoutTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
      <Tabs value={value} onChange={(_, v) => onChange(v)}>
        <Tab label="All" value="all" />
        <Tab label="Sellers" value="seller" />
        <Tab label="Drivers" value="driver" />
      </Tabs>
    </Box>
  );
}
