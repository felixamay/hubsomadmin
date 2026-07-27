"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
} from "@mui/material";
import {
  updateCategoryAction,
  addCategoryAction,
  deleteCategoryAction,
} from "@/application/services/admin-actions";
import type { Category } from "@/domain/entities";

interface Props {
  categories: Category[];
}

export function CategoryManager({ categories }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);

  async function handleAdd() {
    if (!name.trim() || !slug.trim()) return;
    setPending(true);
    await addCategoryAction({ name: name.trim(), slug: slug.trim(), description: description.trim() });
    setName("");
    setSlug("");
    setDescription("");
    setAddOpen(false);
    setPending(false);
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={750}>
          {categories.length} Categories
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#0a3d5c" }}
          onClick={() => setAddOpen(true)}
        >
          + Add Category
        </Button>
      </Stack>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {categories.map((cat) => (
          <Paper
            key={cat.id}
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid rgba(10,61,92,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography fontWeight={700}>{cat.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                /{cat.slug} · {cat.productCount} products · sort #{cat.sortOrder}
              </Typography>
            </Box>

 <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center" >
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={cat.visible}
                    onChange={(e) => updateCategoryAction(cat.id, { visible: e.target.checked })}
                  />
                }
                label={<Typography variant="caption">Visible</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={cat.featured}
                    onChange={(e) => updateCategoryAction(cat.id, { featured: e.target.checked })}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#f36f21" } }}
                  />
                }
                label={<Typography variant="caption">Featured</Typography>}
              />
              {cat.featured && <Chip size="small" label="Featured" sx={{ bgcolor: "#f36f21", color: "#fff" }} />}
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => deleteCategoryAction(cat.id)}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Category Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              fullWidth
              autoFocus
            />
            <TextField
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#0a3d5c" }}
            onClick={handleAdd}
            disabled={pending || !name.trim() || !slug.trim()}
          >
            {pending ? "Saving…" : "Add Category"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
