import { adminStore } from "@/infrastructure/persistence/store";
import { ReviewsClient } from "./ReviewsClient";

export default function ReviewsPage() {
  const reviews = adminStore.getReviews();
  return <ReviewsClient reviews={reviews} />;
}
