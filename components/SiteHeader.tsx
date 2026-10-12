"use client";
import { useState, useRef, useEffect } from "react";
import { ShoppingBag, ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
import { whatsapp } from "@/lib/catalog";
export default function SiteHeader({
  count,
  onOpen,
}: {
  count: number;
  onOpen: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);
  return (
    <header>
      <a href="#" className="wordmark" aria-label="Silk Road home">
        <Brand />
      </a>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={menu ? "nav mobile-open" : "nav"}
      >
        <a href="#about" onClick={() => setMenu(false)}>
          {"The company"}
        </a>
        <a href="#collection" onClick={() => setMenu(false)}>
          {"Our collection"}
        </a>
        <a href="#services" onClick={() => setMenu(false)}>
          {"Custom sourcing"}
        </a>
      </nav>
      <div className="header-actions">
        <button
          className="bag-button"
          onClick={onOpen}
          aria-label={`Open order, ${count} cartons`}
        >
          <ShoppingBag size={17} />
          <span className="bag-label">Your enquiry</span>
          <b>{count}</b>
        </button>
        <a
          className="header-contact"
          href={whatsapp(
            "Hello Silk Road! I would like to discuss a trade enquiry.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          {"Let’s talk"}
          <ArrowUpRight size={15} />
        </a>
        <button
          ref={menuButton}
          className="menu-button"
          aria-label="Toggle navigation"
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
