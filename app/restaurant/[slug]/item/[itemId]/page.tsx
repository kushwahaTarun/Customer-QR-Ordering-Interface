import { notFound } from "next/navigation";
import { FoodDetail } from "@/components/FoodDetail";
import { getMenuItem, getMenuItems } from "@/services/menuService";
import { getRestaurantSlugs } from "@/services/restaurantService";

export async function generateStaticParams() {
  const slugs = getRestaurantSlugs();
  const params: { slug: string; itemId: string }[] = [];
  for (const slug of slugs) {
    const items = await getMenuItems(slug);
    for (const item of items) {
      params.push({ slug, itemId: item.id });
    }
  }
  return params;
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string; itemId: string }>;
}) {
  const { slug, itemId } = await params;
  const item = await getMenuItem(slug, itemId);
  if (!item) notFound();
  return <FoodDetail item={item} />;
}
