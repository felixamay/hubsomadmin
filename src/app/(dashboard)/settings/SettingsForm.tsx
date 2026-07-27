"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import { updateSettingsAction } from "@/application/services/admin-actions";
import type { PlatformSettings } from "@/domain/entities";

export function SettingsForm({ settings }: { settings: PlatformSettings }) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await updateSettingsAction(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Box sx={{ maxWidth: 820 }}>
      <Paper elevation={0} sx={{ p: 3, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={750} sx={{ mb: 2.5 }}>
          Fees & Commission
        </Typography>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Platform Commission %"
              type="number"
              value={form.platformCommissionPct}
              onChange={(e) => update("platformCommissionPct", Number(e.target.value))}
              fullWidth
              slotProps={{ htmlInput: { min: 0, max: 100, step: 0.5 } }}
            />
            <TextField
              label="Payment Processing Fee %"
              type="number"
              value={form.paymentProcessingFeePct}
              onChange={(e) => update("paymentProcessingFeePct", Number(e.target.value))}
              fullWidth
              slotProps={{ htmlInput: { min: 0, max: 100, step: 0.1 } }}
            />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Delivery Base Fee (GHS)"
              type="number"
              value={form.deliveryBaseFeeGhs}
              onChange={(e) => update("deliveryBaseFeeGhs", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Delivery per KM (GHS)"
              type="number"
              value={form.deliveryPerKmGhs}
              onChange={(e) => update("deliveryPerKmGhs", Number(e.target.value))}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Min Payout (GHS)"
              type="number"
              value={form.minPayoutGhs}
              onChange={(e) => update("minPayoutGhs", Number(e.target.value))}
              fullWidth
            />
            <TextField
              select
              label="Payout Schedule"
              value={form.payoutSchedule}
              onChange={(e) => update("payoutSchedule", e.target.value as PlatformSettings["payoutSchedule"])}
              fullWidth
            >
              {["daily", "weekly", "biweekly", "monthly"].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={750} sx={{ mb: 2.5 }}>
          Tax Settings
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={form.taxEnabled}
                  onChange={(e) => update("taxEnabled", e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#7cbf2c" } }}
                />
              }
              label="Tax Enabled"
            />
            <TextField
              label="Tax %"
              type="number"
              value={form.taxPct}
              onChange={(e) => update("taxPct", Number(e.target.value))}
              sx={{ width: 160 }}
              disabled={!form.taxEnabled}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={750} sx={{ mb: 2.5 }}>
          Driver Verification
        </Typography>
        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={form.verificationRequireFaceScan}
                onChange={(e) => update("verificationRequireFaceScan", e.target.checked)}
              />
            }
            label="Require Face Scan"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.verificationRequireVehicleDocs}
                onChange={(e) => update("verificationRequireVehicleDocs", e.target.checked)}
              />
            }
            label="Require Vehicle Documents"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.autoPayoutEnabled}
                onChange={(e) => update("autoPayoutEnabled", e.target.checked)}
                sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#7cbf2c" } }}
              />
            }
            label="Auto Payout Enabled"
          />
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          sx={{ bgcolor: "#0a3d5c" }}
          onClick={handleSave}
          disabled={saving}
          size="large"
        >
          {saving ? "Saving…" : "Save Settings"}
        </Button>
        {saved && <Chip label="Saved!" color="success" />}
      </Stack>
    </Box>
  );
}
