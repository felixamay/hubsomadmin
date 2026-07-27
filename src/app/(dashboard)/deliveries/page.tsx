import { adminStore } from "@/infrastructure/persistence/store";
import { DeliveriesClient } from "./DeliveriesClient";

export default function DeliveriesPage() {
  const deliveries = adminStore.getDeliveries();
  const drivers = adminStore.getDrivers();
  const onlineDriver = drivers.find((d) => d.status === "online" && d.canGoOnline);

  return (
    <DeliveriesClient
      deliveries={deliveries}
      firstOnlineDriverId={onlineDriver?.id}
      firstOnlineDriverName={onlineDriver?.fullName}
    />
  );
}
