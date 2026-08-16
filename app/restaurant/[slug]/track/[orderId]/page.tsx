import { OrderTracking } from "@/features/order/OrderTracking";

export default async function TrackRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderTracking orderId={orderId} />;
}
