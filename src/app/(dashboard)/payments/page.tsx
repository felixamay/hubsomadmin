import { adminStore } from "@/infrastructure/persistence/store";
import { PaymentsClient } from "./PaymentsClient";

export default function PaymentsPage() {
  const payments = adminStore.getPayments();
  return <PaymentsClient payments={payments} />;
}
