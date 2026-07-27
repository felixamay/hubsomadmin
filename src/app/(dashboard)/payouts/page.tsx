import { adminStore } from "@/infrastructure/persistence/store";
import { PayoutsClient } from "./PayoutsClient";

export default function PayoutsPage() {
  const payouts = adminStore.getPayouts();
  return <PayoutsClient payouts={payouts} />;
}
