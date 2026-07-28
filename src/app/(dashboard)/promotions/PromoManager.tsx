"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  EMPTY_HUBSOM_PROMOTION,
  HUBSOM_TONES,
  type HubsomAdminCatalog,
  type HubsomPlacement,
  type HubsomPromotion,
  type HubsomPromotionInput,
} from "@/domain/hubsom-promotions";

const FALLBACK_PLACEMENTS: HubsomAdminCatalog["placements"] = [
  { id: "landing", label: "Landing page", description: "Home / landing promo rail" },
  { id: "marketplace", label: "Marketplace / products", description: "Products listing" },
  { id: "category", label: "Category pages", description: "Category browse + detail" },
  { id: "product", label: "Product pages", description: "Product detail pages" },
];

export function PromoManager() {
  const [catalog, setCatalog] = useState<HubsomAdminCatalog | null>(null);
  const [items, setItems] = useState<HubsomPromotion[]>([]);
  const [form, setForm] = useState<HubsomPromotionInput>(EMPTY_HUBSOM_PROMOTION);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState("");

  const needsCategories = form.placements.includes("category");
  const needsProducts = form.placements.includes("product");

  const placements = catalog?.placements?.length ? catalog.placements : FALLBACK_PLACEMENTS;
  const categories = catalog?.categories ?? [];
  const products = useMemo(() => {
    const list = catalog?.products ?? [];
    const q = productFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [catalog, productFilter]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, listRes] = await Promise.all([
        fetch("/api/hubsom/catalog"),
        fetch("/api/hubsom/promotions"),
      ]);
      const catData = await catRes.json();
      const listData = await listRes.json();
      if (!catRes.ok) {
        setError(catData.error ?? "Could not load Hubsom catalog");
      } else {
        setCatalog(catData);
      }
      if (!listRes.ok) {
        setError((prev) => prev ?? listData.error ?? "Could not load promotions");
        setItems([]);
      } else {
        setItems(listData.promotions ?? []);
      }
    } catch {
      setError("Could not reach Hubsom admin APIs — check HUBSOM_API_BASE_URL + HUBSOM_ADMIN_API_KEY");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function togglePlacement(id: HubsomPlacement) {
    setForm((prev) => {
      const has = prev.placements.includes(id);
      const placementsNext = has
        ? prev.placements.filter((p) => p !== id)
        : [...prev.placements, id];
      return {
        ...prev,
        placements: placementsNext,
        categorySlugs: placementsNext.includes("category") ? prev.categorySlugs ?? [] : [],
        productIds: placementsNext.includes("product") ? prev.productIds ?? [] : [],
      };
    });
  }

  function resetForm() {
    setForm(EMPTY_HUBSOM_PROMOTION);
    setEditingId(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setError(null);

    const payload: HubsomPromotionInput = {
      ...form,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      ctaLabel: form.ctaLabel.trim() || "Shop now",
      href: form.href.trim(),
      imageUrl: form.imageUrl?.trim() || undefined,
      categorySlugs: needsCategories ? form.categorySlugs ?? [] : [],
      productIds: needsProducts ? form.productIds ?? [] : [],
      sortOrder: Number(form.sortOrder) || 100,
    };

    try {
      const res = await fetch(
        editingId
          ? `/api/hubsom/promotions?id=${encodeURIComponent(editingId)}`
          : "/api/hubsom/promotions",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingId ? payload : { promotion: payload }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      setStatus(editingId ? `Updated ${data.promotion.id}` : `Saved ${data.promotion.id}`);
      resetForm();
      await refresh();
    } catch {
      setError("Save failed — network error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this promotion from Hubsom?")) return;
    setError(null);
    const res = await fetch(`/api/hubsom/promotions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Delete failed");
      return;
    }
    if (editingId === id) resetForm();
    await refresh();
  }

  function startEdit(item: HubsomPromotion) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      subtitle: item.subtitle ?? "",
      ctaLabel: item.ctaLabel ?? "Shop now",
      href: item.href,
      tone: item.tone ?? "forest",
      placements: item.placements?.length ? [...item.placements] : ["landing"],
      categorySlugs: item.categorySlugs ?? [],
      productIds: item.productIds ?? [],
      imageUrl: item.imageUrl ?? "",
      sortOrder: item.sortOrder ?? 100,
      active: item.active,
      startsAt: item.startsAt ?? null,
      endsAt: item.endsAt ?? null,
    });
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Promotions sync to Hubsom storefront slots you select (landing, marketplace, category,
          product).
        </Typography>
        <Button
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={() => void refresh()}
          disabled={loading}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {status && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setStatus(null)}>
          {status}
        </Alert>
      )}

      <Paper
        elevation={0}
        component="form"
        onSubmit={onSubmit}
        sx={{ p: { xs: 2, sm: 3 }, mb: 3, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2 }}
      >
        <Typography variant="h6" fontWeight={750} sx={{ mb: 0.5 }}>
          {editingId ? "Edit promotion" : "Create promotion"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {editingId
            ? `Editing ${editingId}`
            : "Choose placements, then optionally narrow category/product targeting."}
        </Typography>

        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="CTA label"
              value={form.ctaLabel}
              onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
              fullWidth
            />
          </Stack>

          <TextField
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            fullWidth
            multiline
            minRows={2}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Link (href)"
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              required
              fullWidth
              placeholder="/marketplace or https://…"
              helperText="Hubsom path or absolute URL"
            />
            <TextField
              select
              label="Tone"
              value={form.tone}
              onChange={(e) =>
                setForm({ ...form, tone: e.target.value as HubsomPromotionInput["tone"] })
              }
              fullWidth
              sx={{ maxWidth: { md: 200 } }}
            >
              {HUBSOM_TONES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Sort order"
              type="number"
              value={form.sortOrder ?? 100}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              fullWidth
              sx={{ maxWidth: { md: 160 } }}
              helperText="Lower = first"
            />
          </Stack>

          <TextField
            label="Image URL (optional)"
            value={form.imageUrl ?? ""}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            fullWidth
          />

          <Box>
            <Typography variant="subtitle2" fontWeight={750} sx={{ mb: 1 }}>
              Placements
            </Typography>
            <FormGroup>
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.5}>
                {placements.map((p) => (
                  <FormControlLabel
                    key={p.id}
                    control={
                      <Checkbox
                        checked={form.placements.includes(p.id)}
                        onChange={() => togglePlacement(p.id)}
                        size="small"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={650}>
                          {p.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {p.description}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      alignItems: "flex-start",
                      mr: 2,
                      mb: 1,
                      minWidth: { xs: "100%", sm: 200 },
                    }}
                  />
                ))}
              </Stack>
            </FormGroup>
          </Box>

          {needsCategories && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(0,174,239,0.06)",
                border: "1px solid rgba(0,174,239,0.18)",
              }}
            >
              <Typography variant="subtitle2" fontWeight={750}>
                Categories (empty = all category pages)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Selected: {(form.categorySlugs ?? []).length || "all"}
              </Typography>
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={0.5}>
                {categories.map((c) => {
                  const checked = (form.categorySlugs ?? []).includes(c.slug);
                  return (
                    <Chip
                      key={c.slug}
                      label={c.name}
                      clickable
                      color={checked ? "info" : "default"}
                      variant={checked ? "filled" : "outlined"}
                      onClick={() =>
                        setForm((prev) => {
                          const current = prev.categorySlugs ?? [];
                          return {
                            ...prev,
                            categorySlugs: checked
                              ? current.filter((s) => s !== c.slug)
                              : [...current, c.slug],
                          };
                        })
                      }
                      sx={{ mb: 0.5 }}
                    />
                  );
                })}
                {categories.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No categories returned from Hubsom catalog.
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {needsProducts && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(243,111,33,0.06)",
                border: "1px solid rgba(243,111,33,0.18)",
              }}
            >
              <Typography variant="subtitle2" fontWeight={750}>
                Products (empty = all product pages)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Selected: {(form.productIds ?? []).length || "all"}
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Filter products…"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <Box sx={{ maxHeight: 220, overflow: "auto" }}>
                <Stack spacing={0.25}>
                  {products.map((p) => {
                    const checked = (form.productIds ?? []).includes(p.id);
                    return (
                      <FormControlLabel
                        key={p.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={checked}
                            onChange={() =>
                              setForm((prev) => {
                                const current = prev.productIds ?? [];
                                return {
                                  ...prev,
                                  productIds: checked
                                    ? current.filter((id) => id !== p.id)
                                    : [...current, p.id],
                                };
                              })
                            }
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {p.name}{" "}
                            <Typography component="span" variant="caption" color="text.secondary">
                              ({p.category})
                            </Typography>
                          </Typography>
                        }
                      />
                    );
                  })}
                  {products.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No products in catalog{productFilter ? " match this filter" : ""}.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
          >
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  color="success"
                />
              }
              label={form.active ? "Active on Hubsom" : "Inactive"}
            />
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {editingId && (
                <Button variant="text" onClick={resetForm}>
                  Cancel edit
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={saving || !form.title.trim() || !form.href.trim() || form.placements.length === 0}
                sx={{ bgcolor: "#0a3d5c", "&:hover": { bgcolor: "#072f47" }, minWidth: 180 }}
              >
                {saving ? "Saving…" : editingId ? "Update on Hubsom" : "Save to Hubsom"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, border: "1px solid rgba(10,61,92,0.08)", borderRadius: 2 }}
      >
        <Typography variant="h6" fontWeight={750} sx={{ mb: 2 }}>
          Live on Hubsom ({items.length})
        </Typography>

        {loading && items.length === 0 ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={28} />
          </Stack>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No promotions yet. Create one above — it will appear on Hubsom surfaces matching the
            selected placements.
          </Typography>
        ) : (
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  justifyContent: "space-between",
                  alignItems: { sm: "flex-start" },
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                    <Typography variant="subtitle1" fontWeight={750}>
                      {item.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={item.active ? "active" : "inactive"}
                      color={item.active ? "success" : "default"}
                    />
                    <Chip size="small" label={item.tone} variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    {item.subtitle || "—"} · {item.href}
                  </Typography>
                  <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                    {(item.placements ?? []).map((p) => (
                      <Chip key={p} size="small" label={p} color="info" variant="outlined" />
                    ))}
                    {(item.categorySlugs?.length ?? 0) > 0 && (
                      <Chip
                        size="small"
                        label={`${item.categorySlugs!.length} categories`}
                        variant="outlined"
                      />
                    )}
                    {(item.productIds?.length ?? 0) > 0 && (
                      <Chip
                        size="small"
                        label={`${item.productIds!.length} products`}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => void remove(item.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
