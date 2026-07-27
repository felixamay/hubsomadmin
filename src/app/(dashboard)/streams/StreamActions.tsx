"use client";

import { Button, Stack } from "@mui/material";
import { updateStreamAction } from "@/application/services/admin-actions";
import type { LiveStream } from "@/domain/entities";

export function StreamActions({ stream }: { stream: LiveStream }) {
  const { id, status, featured } = stream;
  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {status === "live" && (
        <Button size="small" variant="outlined" color="error"
          onClick={() => updateStreamAction(id, { status: "ended", endedAt: new Date().toISOString() })}
        >End Stream</Button>
      )}
      {!featured && (
        <Button size="small" variant="outlined"
          sx={{ color: "#f36f21", borderColor: "#f36f21" }}
          onClick={() => updateStreamAction(id, { featured: true })}
        >Feature</Button>
      )}
      {featured && (
        <Button size="small" variant="outlined" color="warning"
          onClick={() => updateStreamAction(id, { featured: false })}
        >Unfeature</Button>
      )}
    </Stack>
  );
}
