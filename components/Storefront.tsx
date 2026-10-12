"use client";
import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ShoppingBag, ArrowUpRight, Check } from "lucide-react";
import SiteHeader from "./SiteHeader";
import ProductCatalog from "./ProductCatalog";
import { useWholesaleOrder } from "@/hooks/useWholesaleOrder";
const OrderDialog = dynamic(() => import("./OrderDialog"), { ssr: false });
export default function Storefront({
  introduction,
  closing,
  footer,
}: {
  introduction: ReactNode;
  closing: ReactNode;
  footer: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { cart, count, selected, change, add, added } = useWholesaleOrder();
  return (
    <>
      <a className="skip" href="#collection">
        Skip to ingredients
      </a>
      <SiteHeader count={count} onOpen={() => setOpen(true)} />
      <main>
        {introduction}
        <ProductCatalog cart={cart} added={added} onAdd={add} />
        {closing}
      </main>
      {footer}
      {count > 0 && !open && (
        <button
          className="enquiry-tray"
          onClick={() => setOpen(true)}
          aria-label={`Review enquiry with ${count} cartons`}
        >
          <span className="tray-icon">
            <ShoppingBag size={18} />
            <b>{count}</b>
          </span>
          <span>
            {" "}
            Your collection is taking shape
            <small>
              {selected.length}{" "}
              {selected.length === 1 ? "ingredient" : "ingredients"} · {count}{" "}
              {count === 1 ? "carton" : "cartons"}
            </small>
          </span>
          <span className="tray-action">
            Review enquiry <ArrowUpRight size={18} />
          </span>
        </button>
      )}
      <div className="toast" role="status" aria-live="polite">
        {added && (
          <>
            <Check size={17} />
            {"One carton added to your order"}
            <button onClick={() => setOpen(true)}>{"View order"} ↗</button>
          </>
        )}
      </div>
      {open && (
        <OrderDialog
          cart={cart}
          selected={selected}
          count={count}
          change={change}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
