import { MARQUEE } from "@/content/landing";

// Static top-of-page pieces: marquee strip, sticky header, hero, lineup bar.

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]; // doubled so the loop is seamless
  return (
    <div style={{ overflow: "hidden", background: "var(--color-accent)", color: "#fff", height: 30, display: "flex", alignItems: "center" }}>
      <div className="pw-marquee pw-eyebrow" style={{ display: "flex", flex: "0 0 auto", whiteSpace: "nowrap", letterSpacing: "0.22em" }}>
        {items.map((m, i) => (
          <span key={i} style={{ padding: "0 var(--space-6)" }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

const link = { textDecoration: "none" } as const;

export function Header() {
  return (
    <header className="pw-border-b" style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--color-bg)" }}>
      <div className="pw-eyebrow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-3) var(--space-4)" }}>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <a href="#lineup" style={link}>Shirts</a>
          <a href="#lineup" style={link}>Knit</a>
          <a href="#lineup" style={link}>Pants</a>
          <a href="#lineup" style={link}>Outer</a>
          <a href="#look" style={{ ...link, color: "var(--color-accent)" }}>Shop the look</a>
        </nav>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <a href="#story" style={link}>About</a>
          <a href="#faq" style={link}>FAQ</a>
          <a href="#inquiry" style={link}>문의</a>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="pw-border-b" style={{ position: "relative" }}>
      <div className="grayscale pw-ph" style={{ minHeight: "min(78vh, 620px)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "var(--space-6) var(--space-4)" }}>
        <div className="pw-mono" style={{ alignSelf: "flex-start", padding: "4px 8px" }}>HERO — 모델 착용 전신 와이드컷 (16:9, 흑백)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="pw-eyebrow pw-eyebrow-wide" style={{ background: "var(--color-bg)", alignSelf: "flex-start", padding: "4px 8px" }}>Men&rsquo;s everyday casual</div>
          <h1 style={{ margin: 0, fontSize: "clamp(40px, 8vw, 104px)", lineHeight: 0.94, letterSpacing: "-0.02em", maxWidth: "16ch", background: "var(--color-bg)", alignSelf: "flex-start", padding: "var(--space-2) var(--space-3)" }}>
            PLAINWORK
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
            <a href="#lineup" className="btn btn-primary btn-lg">상품 보기</a>
            <a href="#inquiry" className="btn btn-secondary btn-lg" style={{ background: "var(--color-bg)" }}>구매 문의</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LineupBar() {
  return (
    <div className="pw-eyebrow pw-border-b" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-3) var(--space-4)" }}>
      <span>2026 상시 판매 8품목</span>
      <span className="text-muted">사이즈 S — XL · 문의 후 개별 안내</span>
    </div>
  );
}
