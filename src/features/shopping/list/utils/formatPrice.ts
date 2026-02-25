export function formatShoppingInfo(
  price: number | null,
  quantity: number | null
): string {
  const parts: string[] = [];

  if (price != null && price > 0) {
    parts.push(`${price.toLocaleString()}원`);
  }

  if (quantity != null && quantity > 1) {
    parts.push(`${quantity}개`);
  }

  return parts.join(" · ");
}
