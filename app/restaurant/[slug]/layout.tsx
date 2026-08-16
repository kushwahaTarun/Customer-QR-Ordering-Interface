import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiningProviders } from "@/features/dining/DiningProviders";
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

  return <DiningProviders restaurant={restaurant}>{children}</DiningProviders>;
}
