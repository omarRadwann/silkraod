import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeCart, changeQuantity, buildOrderUrl, formatPrice, orderSubtotal } from "../lib/order.ts";
import { products } from "../lib/catalog.ts";

test("saved orders accept only known SKUs and positive integer quantities", () => {
  assert.deepEqual(
    sanitizeCart({ a: 2, b: 3.5, c: -2, d: "4", unknown: 9 }, [
      "a",
      "b",
      "c",
      "d",
    ]),
    { a: 2 },
  );
  for (const invalid of [null, [], "bad", 7])
    assert.deepEqual(sanitizeCart(invalid, ["a"]), {});
  assert.deepEqual(sanitizeCart({ a: 2000 }, ["a"]), { a: 999 });
});
test("quantity updates preserve the original order and enforce item limits", () => {
  const cart = { a: 2, b: 999 };
  assert.deepEqual(changeQuantity(cart, "a", -2), { b: 999 });
  assert.equal(changeQuantity(cart, "b", 1).b, 999);
  assert.deepEqual(cart, { a: 2, b: 999 });
});
test("WhatsApp handoff contains every selected SKU, pack and item quantity", () => {
  const selected = [
    { id: "A1", name: "Matcha & Taro", weight: "1 kg", carton: 20, priceEGP: 925 },
    { id: "B2", name: "Mango", weight: "1.2 kg", carton: 12, priceEGP: 420 },
  ];
  const url = new URL(buildOrderUrl(selected, { A1: 2, B2: 3 }));
  assert.equal(url.origin + url.pathname, "https://wa.me/201097477503");
  const text = url.searchParams.get("text");
  assert.match(
    text,
    /2 item\(s\) × Matcha & Taro \| 1 kg each \| SKU A1/,
  );
  assert.match(text, /3 item\(s\) × Mango \| 1.2 kg each \| SKU B2/);
  assert.doesNotMatch(text, /carton|20 pcs|12 pcs/);
  assert.match(text, /Business name:\nDelivery city:/);
  assert.match(text, /EGP 925 each · EGP 1,850 line total/);
  assert.match(text, /EGP 420 each · EGP 1,260 line total/);
  assert.match(text, /Product subtotal: EGP 3,110/);
  assert.match(text, /Delivery charges and availability to be confirmed/);
});

test("published prices cover all seven boba flavours and five other ingredients", () => {
  const boba = products.filter((p) => p.category === "Popping boba");
  assert.equal(boba.length, 7);
  assert.ok(boba.every((p) => p.priceEGP === 420));
  const expected = { "130500521": 240, "130201335": 600, "130201334": 925, "132100600": 1000, "130401971": 390 };
  for (const [id, price] of Object.entries(expected))
    assert.equal(products.find((p) => p.id === id)?.priceEGP, price);
  assert.equal(products.length, 12);
});

test("per-item totals handle mixed quantities, removals and unknown cart entries", () => {
  const mango = products.find((p) => p.name === "Mango");
  const syrup = products.find((p) => p.id === "132100600");
  const selected = [mango, syrup];
  const cart = { [mango.id]: 3, [syrup.id]: 2, unknown: 50 };
  assert.equal(orderSubtotal(selected, cart), 3260);
  const removed = changeQuantity(cart, syrup.id, -2);
  assert.equal(orderSubtotal(selected, removed), 1260);
  assert.equal(orderSubtotal(selected, {}), 0);
  const message = new URL(buildOrderUrl(selected, removed)).searchParams.get("text");
  assert.doesNotMatch(message, /Brown Sugar/);
  assert.match(message, /Product subtotal: EGP 1,260/);
  assert.equal(formatPrice(1000), "EGP 1,000");
});
