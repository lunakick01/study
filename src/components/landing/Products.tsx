"use client";

import type { CSSProperties } from "react";
import { LOOK_INDEXES, PRODUCTS, formatPrice } from "@/content/landing";
import { useInquiry } from "./InquiryContext";

// Product grid + "Shop the look" — both jump to the inquiry form with the product preselected.

export function ProductGrid() {
  const { jumpTo } = useInquiry();
  return (
    <section id="lineup" className="pw-border-b">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 230px), 1fr))" }}>
        {PRODUCTS.map((p, i) => (
          <article key={p.name} className="pw-border-r pw-border-b" style={{ display: "flex", flexDirection: "column" }}>
            <div className={`grayscale ${i % 2 === 0 ? "pw-ph-sm" : "pw-ph-alt"}`} style={{ position: "relative", aspectRatio: "1 / 1", display: "flex", alignItems: "flex-end", padding: "var(--space-2)" }}>
              <span className="pw-mono">{p.shot}</span>
              {p.badge && (
                <span className="tag tag-accent" style={{ position: "absolute", top: "var(--space-2)", left: "var(--space-2)", fontSize: 9, letterSpacing: "0.16em" }}>{p.badge}</span>
              )}
            </div>
            <div style={{ padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <div className="pw-label">{p.name}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{p.subtitle}</div>
              <div style={{ marginTop: "auto", paddingTop: "var(--space-3)", fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em" }}>{formatPrice(p.price)}</div>
              <button type="button" className="pw-linkbtn" onClick={() => jumpTo(p.name)}>이 상품 문의 →</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ShopTheLook() {
  const { jumpTo } = useInquiry();
  const look = LOOK_INDEXES.map((i) => PRODUCTS[i]);
  return (
    <section id="look" className="pw-border-b pw-grid-auto" style={{ "--pw-min": "340px" } as CSSProperties}>
      <div className="grayscale pw-ph pw-border-r" style={{ minHeight: 520, display: "flex", alignItems: "flex-end", padding: "var(--space-3)" }}>
        <span className="pw-mono">LOOK 01 — 셔츠 + 치노 착용 전신</span>
      </div>
      <div>
        <div className="pw-eyebrow pw-border-b" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-3) var(--space-4)" }}>
          <span>Shop the look</span>
          <span className="text-muted">Look 01/02</span>
        </div>
        {look.map((l) => (
          <div key={l.name} className="pw-border-b" style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)" }}>
            <div className="grayscale pw-ph-xs" style={{ flex: "0 0 84px", aspectRatio: "1 / 1" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "baseline" }}>
                <span className="pw-label">{l.name}</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 600 }}>{formatPrice(l.price)}</span>
              </div>
              <p className="text-muted" style={{ margin: 0, fontSize: 13, maxWidth: "44ch" }}>{l.subtitle}</p>
              <button type="button" className="pw-linkbtn" style={{ alignSelf: "flex-start", marginTop: 4 }} onClick={() => jumpTo(l.name)}>문의하기 →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
