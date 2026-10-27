import type { Product } from "./catalog";
export type Cart = Record<string, number>;
export const MAX_UNITS = 999;
export const CART_STORAGE_KEY = "silkraod-unit-order-v2";

export function formatPrice(amount: number): string {
  return `EGP ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function orderSubtotal(selected: readonly Product[], cart: Cart): number {
  return selected.reduce(
    (total, product) => total + Math.max(0, cart[product.id] || 0) * product.priceEGP,
    0,
  );
}

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
      result[id] = Math.min(quantity, MAX_UNITS);
  }
  return result;
}

export function changeQuantity(cart: Cart, id: string, delta: number): Cart {
  const next = { ...cart };
  const quantity = Math.min(MAX_UNITS, Math.max(0, (cart[id] || 0) + delta));
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
        `${cart[p.id]} item(s) × ${p.name} | ${p.weight} each | SKU ${p.id}\n${formatPrice(p.priceEGP)} each · ${formatPrice(cart[p.id] * p.priceEGP)} line total`,
    );
  const message = `Hello Silk Road! I would like to order:\n\n${lines.join("\n\n")}\n\nProduct subtotal: ${formatPrice(orderSubtotal(selected, cart))}\nDelivery charges and availability to be confirmed.\n\nBusiness name:\nDelivery city:\nPreferred delivery date:`;
  return `https://wa.me/201097477503?text=${encodeURIComponent(message)}`;
}
