import { OrderConfirmation } from "@/features/order/OrderConfirmation";

export default async function OrderRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderConfirmation orderId={orderId} />;
}
