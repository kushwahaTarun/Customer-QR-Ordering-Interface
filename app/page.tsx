import { ScanLanding } from "@/features/scan/ScanLanding";
import { listRestaurants } from "@/services/restaurantService";

export default async function HomePage() {
  const restaurants = await listRestaurants();
  return <ScanLanding restaurants={restaurants} />;
}
