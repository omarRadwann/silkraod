"use client";
import { useEffect, useRef } from "react";
import {
  X,
  ShoppingBag,
  ArrowUpRight,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";
import { type Product } from "@/lib/catalog";
import { buildOrderUrl } from "@/lib/order";
import { ProductImage } from "./ResponsiveImage";
type Props = {
  cart: Record<string, number>;
  selected: Product[];
  count: number;
  change: (id: string, delta: number) => void;
  onClose: () => void;
};
export default function OrderDialog({
  cart,
  selected,
  count,
  change,
  onClose,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const order = buildOrderUrl(selected, cart);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.current?.close();
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);
  return (
    <dialog
      aria-label={"Your wholesale order"}
      ref={dialog}
      className="order-dialog"
      onClose={onClose}
      onCancel={() => onClose()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="order-panel">
        <div className="order-header">
          <div>
            <div className="eyebrow">{"YOUR WHOLESALE ENQUIRY"}</div>
            <h2>
              {"Your order"}
              <em> ({count})</em>
            </h2>
          </div>
          <button
            className="close"
            onClick={() => onClose()}
            aria-label="Close order"
          >
            <X />
          </button>
        </div>
        {selected.length === 0 ? (
          <div className="empty-order">
            <ShoppingBag size={45} strokeWidth={1} />
            <h3>{"Your collection starts here."}</h3>
            <p>{"Add a few ingredients to start your wholesale enquiry."}</p>
            <button
              className="button dark"
              onClick={() => {
                onClose();
                document.getElementById("collection")?.scrollIntoView();
              }}
            >
              {"Explore ingredients"}
              <ArrowUpRight size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="order-items">
              {selected.map((p) => (
                <div key={p.id} className="order-item">
                  <ProductImage
                    id={p.id}
                    sizes="75px"
                    alt=""
                    style={{ background: p.color }}
                  />
                  <div>
                    <h3>{p.name}</h3>
                    <p>
                      {p.weight} × {p.carton} {"pcs / carton"}
                    </p>
                    <span className="quantity">
                      <button
                        onClick={() => change(p.id, -1)}
                        aria-label={`Remove one carton of ${p.name}`}
                      >
                        <Minus size={14} />
                      </button>
                      <b>{cart[p.id]}</b>
                      <button
                        disabled={cart[p.id] >= 999}
                        onClick={() => change(p.id, 1)}
                        aria-label={`Add one carton of ${p.name}`}
                      >
                        <Plus size={14} />
                      </button>
                      <small>{"cartons"}</small>
                    </span>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => change(p.id, -cart[p.id])}
                    aria-label={`Remove ${p.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <div>
                <span>{"Total cartons"}</span>
                <b>{count}</b>
              </div>
              <p>
                {
                  "This is a quotation request. Our team will confirm prices, stock and delivery on WhatsApp."
                }
              </p>
              <a
                className="button dark"
                href={order}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={19} />
                {"Continue on WhatsApp"}
                <ArrowUpRight size={19} />
              </a>
              <small>
                {"Your enquiry opens as a message. Tap send to share it."}
              </small>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
