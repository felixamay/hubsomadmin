"use client";

import { Button, Stack } from "@mui/material";
import { updateDriverAction } from "@/application/services/admin-actions";
import type { Driver } from "@/domain/entities";

export function DriverActions({ driver }: { driver: Driver }) {
  const { id, verificationStatus } = driver;

  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {verificationStatus === "pending" && (
        <>
          <Button size="small" variant="contained" color="success"
            sx={{ bgcolor: "#7cbf2c" }}
            onClick={() => updateDriverAction(id, { verificationStatus: "approved" })}
          >Approve</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateDriverAction(id, { verificationStatus: "rejected" })}
          >Reject</Button>
          <Button size="small" variant="outlined"
            sx={{ color: "#f7941d", borderColor: "#f7941d" }}
            onClick={() => updateDriverAction(id, { verificationStatus: "more_docs_required" })}
          >More Docs</Button>
        </>
      )}
      {verificationStatus === "approved" && (
        <>
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updateDriverAction(id, { verificationStatus: "suspended" })}
          >Suspend</Button>
          <Button size="small" variant="outlined" color="error"
            onClick={() => updateDriverAction(id, { verificationStatus: "banned" })}
          >Ban</Button>
        </>
      )}
      {(verificationStatus === "suspended" || verificationStatus === "rejected" || verificationStatus === "more_docs_required") && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updateDriverAction(id, { verificationStatus: "approved" })}
        >Restore</Button>
      )}
      {verificationStatus === "banned" && (
        <Button size="small" variant="outlined" color="success"
          onClick={() => updateDriverAction(id, { verificationStatus: "approved" })}
        >Unban</Button>
      )}
    </Stack>
  );
}
