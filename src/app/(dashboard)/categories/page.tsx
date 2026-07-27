import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { CategoryManager } from "./CategoryManager";

export default function CategoriesPage() {
  const categories = adminStore.getCategories();

  return (
    <Box>
      <PageHeader
        title="Categories"
        subtitle="Manage product categories — visibility, featured, and sorting"
      />
      <CategoryManager categories={categories} />
    </Box>
  );
}
