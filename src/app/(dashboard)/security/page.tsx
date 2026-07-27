import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Grid,
} from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { formatDateTime } from "@/lib/currency";
import { StatusChip } from "@/components/tables/DataTable";
import { SessionActions } from "./SessionActions";
import { ROLE_PERMISSIONS } from "@/domain/permissions";

export default function SecurityPage() {
  const sessions = adminStore.getSessions();
  const loginHistory = adminStore.getLoginHistory().slice(0, 30);
  const auditLogs = adminStore.getAuditLogs().slice(0, 40);
  const admins = adminStore.getAdmins();

  return (
    <Box>
      <PageHeader
        title="Security"
        subtitle="Sessions, login history, audit trail, and role permissions"
      />

      <Grid container spacing={3}>
        {/* Active Sessions */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ border: "1px solid rgba(10,61,92,0.08)" }}>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(10,61,92,0.06)" }}>
              <Typography variant="h6" fontWeight={750}>
                Admin Sessions ({sessions.filter((s) => !s.revokedAt).length} active)
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 380, overflowX: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Admin</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Device</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>IP</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Last Active</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((s) => {
                    const admin = admins.find((a) => a.id === s.adminId);
                    return (
                      <TableRow key={s.id} hover>
                        <TableCell>{admin?.name ?? s.adminId}</TableCell>
                        <TableCell>{s.deviceName}</TableCell>
                        <TableCell>{s.ipAddress}</TableCell>
                        <TableCell>{formatDateTime(s.lastActiveAt)}</TableCell>
                        <TableCell>
                          <StatusChip status={s.revokedAt ? "revoked" : "active"} />
                        </TableCell>
                        <TableCell>
                          <SessionActions session={s} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Login History */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ border: "1px solid rgba(10,61,92,0.08)" }}>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(10,61,92,0.06)" }}>
              <Typography variant="h6" fontWeight={750}>
                Login History (last 30)
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 380, overflowX: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>IP</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>MFA</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Result</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loginHistory.map((l) => (
                    <TableRow key={l.id} hover>
                      <TableCell>{l.email}</TableCell>
                      <TableCell>{l.ipAddress}</TableCell>
                      <TableCell>
                        <Chip size="small" label={l.mfaUsed ? "MFA" : "None"}
                          color={l.mfaUsed ? "success" : "default"} variant={l.mfaUsed ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={l.success ? "success" : "failed"} />
                        {!l.success && l.failureReason && (
                          <Typography variant="caption" color="error" sx={{ ml: 0.5 }}>
                            ({l.failureReason})
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{formatDateTime(l.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Audit Log */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ border: "1px solid rgba(10,61,92,0.08)" }}>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(10,61,92,0.06)" }}>
              <Typography variant="h6" fontWeight={750}>
                Audit Log (latest 40)
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Actor</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Entity</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Entity ID</TableCell>
                    <TableCell sx={{ fontWeight: 750, bgcolor: "#f5fbfe" }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.actorName}</TableCell>
                      <TableCell>
                        <Chip size="small" label={log.action} variant="outlined"
                          sx={{ fontSize: 11, fontFamily: "monospace" }}
                        />
                      </TableCell>
                      <TableCell>{log.entityType}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{log.entityId}</TableCell>
                      <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Role Permissions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ border: "1px solid rgba(10,61,92,0.08)" }}>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(10,61,92,0.06)" }}>
              <Typography variant="h6" fontWeight={750}>
                Role Permissions
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => (
                <Box key={role} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={750} sx={{ mb: 0.75, textTransform: "capitalize" }}>
                    {role.replaceAll("_", " ")}
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {perms.slice(0, 8).map((p) => (
                      <Chip key={p} size="small" label={p} variant="outlined"
                        sx={{ fontSize: 10, height: 20 }}
                      />
                    ))}
                    {perms.length > 8 && (
                      <Chip size="small" label={`+${perms.length - 8} more`}
                        sx={{ fontSize: 10, height: 20, bgcolor: "rgba(10,61,92,0.06)" }}
                      />
                    )}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
