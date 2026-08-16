import { notFound } from "next/navigation";
import { CategoryView } from "@/features/menu/CategoryView";
import { getRestaurantBySlug, getRestaurantSlugs } from "@/services/restaurantService";

export async function generateStaticParams() {
  const slugs = getRestaurantSlugs();
  const params: { slug: string; category: string }[] = [];
  for (const slug of slugs) {
    const restaurant = await getRestaurantBySlug(slug);
    params.push({ slug, category: "all" });
    for (const category of restaurant?.categories ?? []) {
      params.push({ slug, category: category.slug });
    }
  }
  return params;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}) {
  const { slug, category } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  const known =
    category === "all" ||
    category === "food" ||
    restaurant?.categories.some((entry) => entry.slug === category);
  if (!restaurant || !known) {
    notFound();
  }
  return <CategoryView categorySlug={category} />;
}
