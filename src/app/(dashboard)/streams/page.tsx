import { adminStore } from "@/infrastructure/persistence/store";
import { StreamsClient } from "./StreamsClient";

export default function StreamsPage() {
  const streams = adminStore.getStreams();
  return <StreamsClient streams={streams} />;
}
