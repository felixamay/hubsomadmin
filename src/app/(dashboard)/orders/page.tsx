import { adminStore } from "@/infrastructure/persistence/store";
import { OrdersClient } from "./OrdersClient";

export default function OrdersPage() {
  const orders = adminStore.getOrders();
  return <OrdersClient orders={orders} />;
}
