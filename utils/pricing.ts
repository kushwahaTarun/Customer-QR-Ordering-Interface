import type { CartLine, CustomizationGroup, MenuItem } from "@/types/dining";

export function createLineId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function optionSignature(selectedOptions: Record<string, string[]>) {
  return Object.entries(selectedOptions)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupId, optionIds]) => `${groupId}:${[...optionIds].sort().join(",")}`)
    .join("|");
}

export function defaultSelections(item: MenuItem): Record<string, string[]> {
  const selected: Record<string, string[]> = {};
  for (const group of item.customizations ?? []) {
    if (group.type === "single" && group.required && group.options[0]) {
      selected[group.id] = [group.options[0].id];
    } else {
      selected[group.id] = [];
    }
  }
  return selected;
}

export function computeUnitPrice(
  item: MenuItem,
  selectedOptions: Record<string, string[]>,
) {
  const extras = (item.customizations ?? []).reduce((sum, group) => {
    const chosen = selectedOptions[group.id] ?? [];
    return (
      sum +
      group.options
        .filter((option) => chosen.includes(option.id))
        .reduce((groupSum, option) => groupSum + option.priceDelta, 0)
    );
  }, 0);
  return item.price + extras;
}

export function describeSelections(
  groups: CustomizationGroup[] | undefined,
  selectedOptions: Record<string, string[]>,
) {
  if (!groups?.length) return [];
  return groups.flatMap((group) => {
    const chosen = selectedOptions[group.id] ?? [];
    return group.options
      .filter((option) => chosen.includes(option.id))
      .map((option) => option.name);
  });
}

export function linesSubtotal(items: CartLine[]) {
  return items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function itemRequiresCustomization(item: MenuItem) {
  return (item.customizations ?? []).some((group) => group.required);
}
