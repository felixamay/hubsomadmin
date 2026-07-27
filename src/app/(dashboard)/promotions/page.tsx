import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { PromoManager } from "./PromoManager";

export default function PromotionsPage() {
  const promotions = adminStore.getPromotions();

  return (
    <Box>
      <PageHeader
        title="Promotions"
        subtitle={`${promotions.length} promotions · ${promotions.filter((p) => p.active).length} active`}
      />
      <PromoManager promotions={promotions} />
    </Box>
  );
}
