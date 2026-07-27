import { adminStore } from "@/infrastructure/persistence/store";
import { ProductsClient } from "./ProductsClient";

export default function ProductsPage() {
  const products = adminStore.getProducts();
  return <ProductsClient products={products} />;
}
