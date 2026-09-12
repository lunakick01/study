"use client";

import { useEffect, useState } from "react";

const link = { textDecoration: "none" } as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ padding: "var(--space-8) var(--space-4) var(--space-6)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "var(--space-6)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(24px, 3vw, 34px)", letterSpacing: "0.04em" }}>PLAINWORK</div>
          <p className="text-muted" style={{ margin: 0, fontSize: 13, maxWidth: "30ch" }}>재입고와 신규 품목 소식을 먼저 받아보세요.</p>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <input className="input" type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: "1 1 160px", minWidth: 0, width: "auto" }} />
            <button type="button" className="btn btn-primary" onClick={() => setSubscribed(true)}>{subscribed ? "신청 완료" : "신청"}</button>
          </div>
        </div>
        <div className="text-muted" style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          <div>상호 (사업자명 입력)</div>
          <div>사업자등록번호 000-00-00000</div>
          <div>통신판매업신고 0000-서울00-0000</div>
          <div>주소 (주소 입력)</div>
        </div>
        <div className="text-muted" style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          <div>대표 (이름 입력)</div>
          <div>전화 0000-0000</div>
          <div>이메일 hello@plainwork.kr</div>
        </div>
        <div className="pw-eyebrow" style={{ display: "flex", flexDirection: "column", gap: 4, letterSpacing: "0.16em" }}>
          <a href="#top" style={link}>Instagram</a>
          <a href="#top" style={link}>Kakao</a>
          <a href="#top" style={link}>개인정보처리방침</a>
          <a href="#top" style={link}>이용약관</a>
        </div>
      </div>
    </footer>
  );
}

// Fixed "구매 문의하기" bar that appears after the visitor scrolls past the hero
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <div className="pw-border-t" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60, background: "var(--color-bg)", padding: "var(--space-2) var(--space-3)" }}>
      <a href="#inquiry" className="btn btn-primary btn-block" style={{ margin: 0 }}>구매 문의하기</a>
    </div>
  );
}
