import { adminStore } from "@/infrastructure/persistence/store";
import { SupportClient } from "./SupportClient";

export default function SupportPage() {
  const tickets = adminStore.getTickets();
  return <SupportClient tickets={tickets} />;
}
