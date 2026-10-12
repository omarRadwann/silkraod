import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeCart, changeQuantity, buildOrderUrl } from "../lib/order.ts";

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
test("quantity updates preserve the original order and enforce carton limits", () => {
  const cart = { a: 2, b: 999 };
  assert.deepEqual(changeQuantity(cart, "a", -2), { b: 999 });
  assert.equal(changeQuantity(cart, "b", 1).b, 999);
  assert.deepEqual(cart, { a: 2, b: 999 });
});
test("WhatsApp handoff contains every selected SKU, pack and carton quantity", () => {
  const selected = [
    { id: "A1", name: "Matcha & Taro", weight: "1 kg", carton: 20 },
    { id: "B2", name: "Mango", weight: "1.2 kg", carton: 12 },
  ];
  const url = new URL(buildOrderUrl(selected, { A1: 2, B2: 3 }));
  assert.equal(url.origin + url.pathname, "https://wa.me/201004227074");
  const text = url.searchParams.get("text");
  assert.match(
    text,
    /2 carton\(s\) × Matcha & Taro \| 1 kg × 20 pcs \| SKU A1/,
  );
  assert.match(text, /3 carton\(s\) × Mango \| 1.2 kg × 12 pcs \| SKU B2/);
  assert.match(text, /Business name:\nDelivery city:/);
});
