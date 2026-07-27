import { adminStore } from "@/infrastructure/persistence/store";
import { ModerationClient } from "./ModerationClient";

export default function ModerationPage() {
  const reports = adminStore.getReports();
  return <ModerationClient reports={reports} />;
}
