"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { products } from "@/lib/catalog";
import {
  CART_STORAGE_KEY,
  changeQuantity,
  sanitizeCart,
  type Cart,
} from "@/lib/order";
const validIds = products.map((p) => p.id);

export function useWholesaleOrder() {
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      setCart(
        sanitizeCart(
          JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}"),
          validIds,
        ),
      );
    } catch {
      /* Private browsing or an invalid saved order: start an empty enquiry. */
    }
    setReady(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* Ordering remains usable when browser storage is unavailable. */
    }
  }, [cart, ready]);
  const change = useCallback((id: string, delta: number) => {
    if (validIds.includes(id)) setCart((old) => changeQuantity(old, id, delta));
  }, []);
  const add = useCallback((id: string) => {
    if (!validIds.includes(id)) return;
    setCart((old) => changeQuantity(old, id, 1));
    setAdded(id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(""), 1700);
  }, []);
  return {
    cart,
    change,
    add,
    added,
    count: Object.values(cart).reduce((a, b) => a + b, 0),
    selected: products.filter((p) => cart[p.id]),
  };
}
