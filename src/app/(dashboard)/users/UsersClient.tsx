"use client";

import { Box } from "@mui/material";
import type { CustomerUser } from "@/domain/entities";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, StatusChip } from "@/components/tables/DataTable";
import { formatGhs, formatDateTime } from "@/lib/currency";
import { UserActions } from "./UserActions";

export function UsersClient({ users }: { users: CustomerUser[] }) {

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle={`${users.length} registered customers`}
      />
      <DataTable
        rows={users}
        searchPlaceholder="Search by name, email, city…"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone", render: (u) => u.phone ?? "—" },
          { key: "city", label: "City", render: (u) => u.city ?? "—" },
          { key: "role", label: "Role" },
          {
            key: "status",
            label: "Status",
            render: (u) => <StatusChip status={u.status} />,
          },
          {
            key: "emailVerified",
            label: "Verified",
            render: (u) => (
              <StatusChip status={u.emailVerified ? "verified" : "unverified"} />
            ),
          },
          {
            key: "orderCount",
            label: "Orders",
            render: (u) => u.orderCount,
          },
          {
            key: "totalSpentGhs",
            label: "Total Spent",
            render: (u) => formatGhs(u.totalSpentGhs),
          },
          {
            key: "createdAt",
            label: "Joined",
            render: (u) => formatDateTime(u.createdAt),
          },
        ]}
        actions={(u) => <UserActions user={u} />}
      />
    </Box>
  );
}
