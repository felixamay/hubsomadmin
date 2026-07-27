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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { addPromotionAction, togglePromotionAction } from "@/application/services/admin-actions";
import type { Promotion } from "@/domain/entities";
import { formatDateTime } from "@/lib/currency";

const PROMO_TYPES = [
  "coupon",
  "discount",
  "flash_sale",
  "referral_bonus",
  "free_delivery",
  "seller_promotion",
  "driver_bonus",
] as const;

interface Props {
  promotions: Promotion[];
}

export function PromoManager({ promotions }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof PROMO_TYPES)[number]>("coupon");
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [audience, setAudience] = useState("all");
  const [pending, setPending] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setPending(true);
    await addPromotionAction({
      name: name.trim(),
      type,
      code: code.trim() || undefined,
      discountPct: discountPct ? Number(discountPct) : undefined,
      audience,
    });
    setName("");
    setCode("");
    setDiscountPct("");
    setPending(false);
  }

  return (
    <Box>
      <Paper elevation={0}
        sx={{ p: 3, mb: 3, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2 }}
      >
        <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
          Create Promotion
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value as typeof type)} fullWidth>
              {PROMO_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t.replaceAll("_", " ")}</MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Promo Code (optional)" value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
            <TextField label="Discount %" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} type="number" fullWidth />
            <TextField select label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} fullWidth>
              {["all", "customers", "sellers", "drivers"].map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>
          </Stack>
          <Button variant="contained" sx={{ bgcolor: "#0a3d5c", alignSelf: "flex-start" }}
            onClick={handleCreate} disabled={pending || !name.trim()}
          >
            {pending ? "Creating…" : "Create Promotion"}
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
        All Promotions ({promotions.length})
      </Typography>
      <Stack spacing={1.5}>
        {promotions.map((promo) => (
          <Paper key={promo.id} elevation={0}
            sx={{ p: 2, border: "1px solid rgba(10,61,92,0.08)", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>{promo.name}</Typography>
 <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 0.5 }} >
                <Chip size="small" label={promo.type.replaceAll("_", " ")} />
                {promo.code && <Chip size="small" label={promo.code} variant="outlined" />}
                {promo.discountPct && <Chip size="small" label={`${promo.discountPct}% off`} sx={{ bgcolor: "#f36f21", color: "#fff" }} />}
                <Chip size="small" label={promo.audience} variant="outlined" />
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
                  {formatDateTime(promo.startsAt)} → {formatDateTime(promo.endsAt)}
                </Typography>
                <Chip size="small" label={`${promo.usageCount} uses`} variant="outlined" />
              </Stack>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={promo.active}
                  onChange={(e) => togglePromotionAction(promo.id, e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#7cbf2c" } }}
                />
              }
              label={<Typography variant="body2">{promo.active ? "Active" : "Inactive"}</Typography>}
            />
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
