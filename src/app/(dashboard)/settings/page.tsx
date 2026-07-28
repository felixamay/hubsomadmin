import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { SettingsForm } from "./SettingsForm";

export default function SettingsPage() {
  const settings = adminStore.getSettings();

  return (
    <Box>
      <PageHeader
        title="Platform Settings"
        subtitle="Fees, commissions, tax, verification, and payout configuration"
      />
      <SettingsForm settings={settings} />
    </Box>
  );
}
