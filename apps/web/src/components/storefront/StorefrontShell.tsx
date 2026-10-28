"use client";

import React, { type ReactNode, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import dynamic from "next/dynamic";
import { ThemeModeToggle } from "../theme-mode-toggle";
import { useOptionalCart } from "../../context/cart-context";

const CartDrawer = dynamic(() => import("./cart/cart-drawer").then((mod) => mod.CartDrawer), { ssr: false });
export interface StorefrontNavLink { label: string; href: string }
export interface StorefrontShellProps { children: ReactNode; storeName: string; storeSlug?: string; cartItemCount?: number; announcement?: string; navLinks?: StorefrontNavLink[]; onCartClick?: () => void }

export function StorefrontShell({ children, storeName, storeSlug, cartItemCount, announcement = "Free shipping on orders over $75", navLinks = [{ label: "Shop all", href: storeSlug ? `/stores/${storeSlug}/products` : "/products" }, { label: "Collections", href: storeSlug ? `/stores/${storeSlug}/collections` : "/collections" }, { label: "Our story", href: storeSlug ? `/stores/${storeSlug}/about` : "/about" }], onCartClick }: StorefrontShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const cart = useOptionalCart();
  const count = cartItemCount ?? cart?.itemCount ?? 0;
  const home = storeSlug ? `/stores/${storeSlug}` : "/";
  return <div className="storefront-layout story-storefront">
    <aside className="storefront-announcement" aria-label="Store announcement"><span>●</span> {announcement} <span>●</span></aside>
    <header className="storefront-header"><div className="storefront-header-inner">
      <button className="storefront-menu-toggle" type="button" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((v) => !v)}>{isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      <a href={home} className="storefront-brand-name" aria-label={`${storeName} home`}><span className="storefront-brand-mark">S</span><span>{storeName}</span></a>
      <nav className={`storefront-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Main navigation">{navLinks.map((link) => <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>{link.label}</a>)}</nav>
      <div className="storefront-actions"><button className="storefront-icon-button" type="button" aria-label="Search"><Search aria-hidden="true" /></button><ThemeModeToggle />{storeSlug && <a href={`/stores/${storeSlug}/account`} className="storefront-account-link">Account</a>}<button type="button" className="storefront-cart-btn" onClick={onCartClick || cart?.openDrawer} aria-label={`Shopping bag with ${count} items`}><ShoppingBag aria-hidden="true" /><span>Bag</span>{count > 0 && <b>{count}</b>}</button></div>
    </div></header>
    <motion.main className="storefront-main" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .45 }}>{children}</motion.main>
    <footer className="storefront-footer"><div className="storefront-footer-inner"><div className="storefront-footer-top"><div><a href={home} className="storefront-footer-brand">{storeName}</a><p>Everyday pieces, made to be lived in.</p></div><div><h4>Explore</h4>{navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div><div><h4>Customer care</h4>{storeSlug && <a href={`/stores/${storeSlug}/account`}>My account</a>}<a href={storeSlug ? `/stores/${storeSlug}/about` : "/about"}>Contact & returns</a></div></div><div className="storefront-footer-bottom"><span>© {new Date().getFullYear()} {storeName}</span><span>Thoughtfully made for your everyday.</span></div></div></footer>
    {cart && <CartDrawer storeSlug={storeSlug} />}
  </div>;
}
