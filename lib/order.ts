import type { Product } from "./catalog";
export type Cart = Record<string, number>;
export const MAX_CARTONS = 999;
export const CART_STORAGE_KEY = "silkraod-cart";

export function sanitizeCart(
  value: unknown,
  validIds: readonly string[],
): Cart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Cart = {};
  for (const id of validIds) {
    const quantity = (value as Record<string, unknown>)[id];
    if (
      typeof quantity === "number" &&
      Number.isInteger(quantity) &&
      quantity > 0
    )
      result[id] = Math.min(quantity, MAX_CARTONS);
  }
  return result;
}

export function changeQuantity(cart: Cart, id: string, delta: number): Cart {
  const next = { ...cart };
  const quantity = Math.min(MAX_CARTONS, Math.max(0, (cart[id] || 0) + delta));
  if (quantity) next[id] = quantity;
  else delete next[id];
  return next;
}

export function buildOrderUrl(
  selected: readonly Product[],
  cart: Cart,
): string {
  const lines = selected
    .filter((p) => cart[p.id] > 0)
    .map(
      (p) =>
        `${cart[p.id]} carton(s) × ${p.name} | ${p.weight} × ${p.carton} pcs | SKU ${p.id}`,
    );
  const message = `Hello Silk Road! I would like a wholesale quotation and availability for:\n\n${lines.join("\n")}\n\nBusiness name:\nDelivery city:\nPreferred delivery date:`;
  return `https://wa.me/201004227074?text=${encodeURIComponent(message)}`;
}
