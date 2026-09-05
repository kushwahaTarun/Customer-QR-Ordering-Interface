import { readStorage, storageKeys, writeStorage } from "@/utils/storage";
import type {
  CreateOrderInput,
  Order,
  OrderKitchenStatus,
  PaymentStatus,
} from "@/types/dining";

const wait = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

const STATUS_SEQUENCE: OrderKitchenStatus[] = [
  "received",
  "preparing",
  "cooking",
  "ready",
];

function readOrders() {
  return readStorage<Order[]>(storageKeys.orders, []);
}

function persistOrders(orders: Order[]) {
  writeStorage(storageKeys.orders, orders);
}

function nextOrderNumber() {
  const current = readStorage<number>(storageKeys.orderSequence, 1024);
  const next = current + 1;
  writeStorage(storageKeys.orderSequence, next);
  return String(next);
}

// Later: POST /api/restaurants/:slug/orders
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await wait(180);
  const createdAt = new Date();
  const prep = 3;
  const order: Order = {
    id: `ord_${createdAt.getTime()}`,
    orderNumber: nextOrderNumber(),
    ...input,
    paymentStatus: input.paymentMethod === "online" ? "pending" : "pending",
    status: "received",
    createdAt: createdAt.toISOString(),
    estimatedReadyAt: new Date(createdAt.getTime() + prep * 60_000).toISOString(),
  };
  persistOrders([order, ...readOrders()]);
  return order;
}

// Later: GET /api/orders/:id
export async function getOrder(orderId: string): Promise<Order | null> {
  await wait(40);
  return readOrders().find((order) => order.id === orderId) ?? null;
}

export async function listOrdersForRestaurant(slug: string) {
  await wait(40);
  return readOrders().filter((order) => order.restaurantSlug === slug);
}

// Later: POST /api/payments/:orderId
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
): Promise<Order | null> {
  await wait(160);
  const orders = readOrders().map((order) =>
    order.id === orderId ? { ...order, paymentStatus } : order,
  );
  persistOrders(orders);
  return orders.find((order) => order.id === orderId) ?? null;
}

export function deriveKitchenStatus(order: Order): OrderKitchenStatus {
  const started = new Date(order.createdAt).getTime();
  const readyAt = new Date(order.estimatedReadyAt).getTime();
  const span = Math.max(readyAt - started, 60_000);
  const progress = (Date.now() - started) / span;
  if (progress >= 0.85) return "ready";
  if (progress >= 0.4) return "cooking";
  if (progress >= 0.12) return "preparing";
  return "received";
}

export async function refreshKitchenStatus(orderId: string): Promise<Order | null> {
  await wait(30);
  const orders = readOrders();
  const current = orders.find((order) => order.id === orderId);
  if (!current) return null;
  const nextStatus = deriveKitchenStatus(current);
  if (nextStatus === current.status) return current;
  const updated = orders.map((order) =>
    order.id === orderId ? { ...order, status: nextStatus } : order,
  );
  persistOrders(updated);
  return updated.find((order) => order.id === orderId) ?? null;
}

export function kitchenSteps() {
  return STATUS_SEQUENCE;
}
