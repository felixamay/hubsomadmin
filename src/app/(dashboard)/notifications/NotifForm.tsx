"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { sendNotificationAction } from "@/application/services/admin-actions";
import type { NotificationCampaign } from "@/domain/entities";
import { formatDateTime } from "@/lib/currency";

const CHANNELS = ["push", "email", "sms", "in_app"] as const;
const AUDIENCES = ["all", "customers", "drivers", "sellers", "specific"] as const;

interface Props {
  notifications: NotificationCampaign[];
}

export function NotifForm({ notifications }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("push");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("all");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!title.trim() || !body.trim()) return;
    setPending(true);
    await sendNotificationAction({ title: title.trim(), body: body.trim(), channel, audience });
    setTitle("");
    setBody("");
    setPending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <Box>
      <Paper elevation={0}
        sx={{ p: 3, mb: 3, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2 }}
      >
        <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
          Send Notification
        </Typography>
        <Stack spacing={2}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField label="Message Body" value={body} onChange={(e) => setBody(e.target.value)} fullWidth multiline rows={3} />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Channel" value={channel} onChange={(e) => setChannel(e.target.value as typeof channel)} fullWidth>
              {CHANNELS.map((c) => (
                <MenuItem key={c} value={c}>{c.replaceAll("_", " ")}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Audience" value={audience} onChange={(e) => setAudience(e.target.value as typeof audience)} fullWidth>
              {AUDIENCES.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="contained" sx={{ bgcolor: "#0a3d5c" }}
              onClick={handleSend}
              disabled={pending || !title.trim() || !body.trim()}
            >
              {pending ? "Sending…" : "Send Now"}
            </Button>
            {sent && <Chip label="Sent!" color="success" size="small" />}
          </Stack>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
        Recent Campaigns ({notifications.length})
      </Typography>
      <Stack spacing={1.5}>
        {notifications.map((n) => (
          <Paper key={n.id} elevation={0}
            sx={{ p: 2, border: "1px solid rgba(10,61,92,0.08)" }}
          >
            <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Box>
                <Typography fontWeight={700}>{n.title}</Typography>
                <Typography variant="body2" color="text.secondary">{n.body}</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap">
                <Chip size="small" label={n.channel} />
                <Chip size="small" label={n.audience} variant="outlined" />
                <Chip size="small" label={n.status}
                  color={n.status === "sent" ? "success" : n.status === "failed" ? "error" : "default"}
                />
                <Typography variant="caption" color="text.secondary">
                  {n.sentAt ? formatDateTime(n.sentAt) : "—"}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
