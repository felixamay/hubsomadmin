"use client";

import { Button, Stack } from "@mui/material";
import { updateReportAction } from "@/application/services/admin-actions";
import type { ContentReport } from "@/domain/entities";

export function ReportActions({ report }: { report: ContentReport }) {
  const { id, status } = report;
  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {status === "open" && (
        <>
          <Button size="small" variant="contained" sx={{ bgcolor: "#7cbf2c" }}
            onClick={() => updateReportAction(id, "resolved")}
          >Resolve</Button>
          <Button size="small" variant="outlined" color="warning"
            onClick={() => updateReportAction(id, "dismissed")}
          >Dismiss</Button>
        </>
      )}
      {status !== "open" && (
        <Button size="small" variant="outlined"
          onClick={() => updateReportAction(id, "open")}
        >Reopen</Button>
      )}
    </Stack>
  );
}
