import type { CSSProperties } from "react";
import { MOSAIC, PILLARS, REVIEWS, STATS, TILES } from "@/content/landing";

// Static mid-page sections: gallery mosaic, pillars, brand story, reviews + stats, info tiles.

export function Gallery() {
  return (
    <section className="pw-border-b pw-grid-auto" style={{ "--pw-min": "320px" } as CSSProperties}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {MOSAIC.map((g) => (
          <div key={g.label} className="pw-border-r pw-border-b">
            <div className="grayscale pw-ph-sm" style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "flex-end", padding: "var(--space-2)" }}>
              <span className="pw-mono">{g.shot}</span>
            </div>
            <div className="pw-eyebrow" style={{ padding: "var(--space-2) var(--space-3)" }}>{g.label}</div>
          </div>
        ))}
      </div>
      <div className="grayscale pw-ph" style={{ minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "var(--space-3)" }}>
        <span className="pw-mono" style={{ alignSelf: "flex-start" }}>디테일 — 원단·봉제 클로즈업 (세로)</span>
        <div className="pw-eyebrow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", background: "var(--color-bg)", padding: "var(--space-2) var(--space-3)" }}>
          <span className="text-muted">01/02 · 디테일</span>
          <a href="#look" style={{ textDecoration: "none", color: "var(--color-accent-700)" }}>Shop now</a>
        </div>
      </div>
    </section>
  );
}

export function Pillars() {
  return (
    <section className="pw-border-b pw-grid-auto" style={{ "--pw-min": "260px" } as CSSProperties}>
      {PILLARS.map((p) => (
        <div key={p.title} className="pw-border-r" style={{ padding: "var(--space-6) var(--space-4)", display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="pw-label" style={{ letterSpacing: "0.18em" }}>{p.title}</div>
          <div className="text-muted" style={{ fontSize: 13, maxWidth: "34ch" }}>{p.body}</div>
        </div>
      ))}
    </section>
  );
}

export function Story() {
  return (
    <section id="story" className="pw-border-b pw-grid-auto" style={{ "--pw-min": "320px" } as CSSProperties}>
      <div className="pw-border-r" style={{ padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "var(--space-4)" }}>
        <div className="pw-eyebrow pw-eyebrow-wide" style={{ color: "var(--color-accent-700)" }}>Our story</div>
        <h2 style={{ margin: 0, fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.06, maxWidth: "22ch" }}>한 벌을 오래 입게 하는 것이 목표입니다</h2>
        <p style={{ margin: 0, maxWidth: "46ch" }}>원단은 국내 공장에서 직접 확인한 것만 씁니다. 계절마다 품목을 늘리는 대신, 같은 옷의 패턴을 고쳐가며 만듭니다. 그래서 신상품은 적고, 재입고는 자주 있습니다.</p>
        <a href="#inquiry" className="btn btn-secondary btn-lg" style={{ alignSelf: "flex-start" }}>브랜드 문의하기</a>
      </div>
      <div className="grayscale pw-ph" style={{ minHeight: 400, display: "flex", alignItems: "flex-end", padding: "var(--space-3)" }}>
        <span className="pw-mono">작업실 — 원단 검단 장면</span>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="pw-border-b pw-grid-auto" style={{ "--pw-min": "300px" } as CSSProperties}>
      <div className="grayscale pw-ph pw-border-r" style={{ minHeight: 420, display: "flex", alignItems: "flex-end", padding: "var(--space-3)" }}>
        <span className="pw-mono">착용컷 — 니트 상반신</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "var(--space-8) var(--space-4)", gap: "var(--space-6)" }}>
        {REVIEWS.map((r) => (
          <div key={r.item} className="pw-border-b" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", paddingBottom: "var(--space-6)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "clamp(15px, 1.6vw, 19px)", lineHeight: 1.35, maxWidth: "38ch" }}>&ldquo;{r.text}&rdquo;</p>
            <div className="pw-eyebrow" style={{ color: "var(--color-accent-700)" }}>{r.item} · {r.who}</div>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--space-4)" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(22px, 2.6vw, 30px)", letterSpacing: "-0.01em" }}>{s.value}</div>
              <div className="text-muted pw-eyebrow" style={{ letterSpacing: "0.16em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Tiles() {
  return (
    <section className="pw-border-b pw-grid-auto" style={{ "--pw-min": "260px" } as CSSProperties}>
      {TILES.map((t) => (
        <div key={t.label} className="pw-border-r">
          <div className="grayscale pw-ph" style={{ aspectRatio: "4 / 5", display: "flex", alignItems: "flex-end", padding: "var(--space-2)" }}>
            <span className="pw-mono">{t.shot}</span>
          </div>
          <div className="pw-eyebrow" style={{ padding: "var(--space-3)" }}>{t.label}</div>
        </div>
      ))}
    </section>
  );
}
