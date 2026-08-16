import { notFound } from "next/navigation";
import { PaymentPage } from "@/features/payment/PaymentPage";

export default async function PaymentRoute({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();
  return <PaymentPage orderId={orderId} />;
}
