import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { DiningProviders } from "@/features/dining/DiningProviders";
import { ACCESS_COOKIE, verifyTableAccess } from "@/lib/tableAccess";
import {
  getRestaurantBySlug,
  getRestaurantSlugs,
} from "@/services/restaurantService";

export function generateStaticParams() {
  return getRestaurantSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return { title: "Restaurant" };
  return {
    title: restaurant.name,
    description: restaurant.description,
  };
}

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const access = await verifyTableAccess(token);
  const tableNumber =
    access?.slug === slug ? access.table : "6";

  return (
    <DiningProviders restaurant={restaurant} tableNumber={tableNumber}>
      {children}
    </DiningProviders>
  );
}
