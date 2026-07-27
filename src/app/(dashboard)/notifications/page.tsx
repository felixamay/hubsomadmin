import { Box } from "@mui/material";
import { PageHeader } from "@/components/ui/PageHeader";
import { adminStore } from "@/infrastructure/persistence/store";
import { NotifForm } from "./NotifForm";

export default function NotificationsPage() {
  const notifications = adminStore.getNotifications();

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.length} campaigns sent`}
      />
      <NotifForm notifications={notifications} />
    </Box>
  );
}
