import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { PromoManager } from "./PromoManager";

export default function PromotionsPage() {
  return (
    <Box>
      <PageHeader
        title="Promotions"
        subtitle="Create Hubsom storefront promos and choose landing, marketplace, category, or product placements"
      />
      <PromoManager />
    </Box>
  );
}
