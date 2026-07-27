"use client";

import { Button, Stack } from "@mui/material";
import { revokeSessionAction } from "@/application/services/admin-actions";
import type { AdminSession } from "@/domain/entities";

export function SessionActions({ session }: { session: AdminSession }) {
  if (session.revokedAt) return null;
  return (
    <Stack direction="row" spacing={0.5}>
      <Button size="small" variant="outlined" color="error"
        onClick={() => revokeSessionAction(session.id)}
      >Revoke</Button>
    </Stack>
  );
}
