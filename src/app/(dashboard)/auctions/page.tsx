import { adminStore } from "@/infrastructure/persistence/store";
import { AuctionsClient } from "./AuctionsClient";

export default function AuctionsPage() {
  const auctions = adminStore.getAuctions();
  return <AuctionsClient auctions={auctions} />;
}
