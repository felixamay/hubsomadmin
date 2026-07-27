import { adminStore } from "@/infrastructure/persistence/store";
import { DriversClient } from "./DriversClient";

export default function DriversPage() {
  const drivers = adminStore.getDrivers();
  return <DriversClient drivers={drivers} />;
}
