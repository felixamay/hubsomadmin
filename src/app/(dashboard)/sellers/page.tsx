import { adminStore } from "@/infrastructure/persistence/store";
import { SellersClient } from "./SellersClient";

export default function SellersPage() {
  const sellers = adminStore.getSellers();
  return <SellersClient sellers={sellers} />;
}
