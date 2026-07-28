import { adminStore } from "@/infrastructure/persistence/store";
import { FraudClient } from "./FraudClient";

export default function FraudPage() {
  const cases = adminStore.getFraudCases();
  return <FraudClient cases={cases} />;
}
