"use client";

import { Button, Stack } from "@mui/material";
import { updateUserAction } from "@/application/services/admin-actions";
import type { CustomerUser } from "@/domain/entities";

export function UserActions({ user }: { user: CustomerUser }) {
  const status = user.status;

  return (
    <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
      {status === "active" && (
        <Button
          size="small"
          variant="outlined"
          color="warning"
          onClick={() => updateUserAction(user.id, { status: "suspended" })}
        >
          Suspend
        </Button>
      )}
      {status === "active" && (
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => updateUserAction(user.id, { status: "banned" })}
        >
          Ban
        </Button>
      )}
      {(status === "banned" || status === "suspended") && (
        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={() => updateUserAction(user.id, { status: "active" })}
        >
          Unban
        </Button>
      )}
      {status === "active" && (
        <Button
          size="small"
          variant="outlined"
          sx={{ color: "#0a3d5c", borderColor: "#0a3d5c" }}
          onClick={() => updateUserAction(user.id, { status: "disabled" })}
        >
          Disable
        </Button>
      )}
      {status === "disabled" && (
        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={() => updateUserAction(user.id, { status: "active" })}
        >
          Enable
        </Button>
      )}
    </Stack>
  );
}
