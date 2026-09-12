"use client";

import { useState, type CSSProperties } from "react";
import { FAQS } from "@/content/landing";

export function Faq() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <section id="faq" className="pw-border-b pw-grid-auto" style={{ "--pw-min": "280px" } as CSSProperties}>
      <div className="pw-border-r" style={{ padding: "var(--space-8) var(--space-4)" }}>
        <div className="pw-eyebrow pw-eyebrow-wide" style={{ color: "var(--color-accent-700)" }}>FAQ</div>
        <h2 style={{ margin: "var(--space-3) 0 0", fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.08, maxWidth: "18ch" }}>자주 묻는 질문</h2>
        <p className="text-muted" style={{ marginTop: "var(--space-3)", fontSize: 13, maxWidth: "32ch" }}>여기에 없는 내용은 아래 문의 폼에 남겨주세요.</p>
      </div>
      <div>
        {FAQS.map((q, i) => (
          <div key={q.question} className="pw-border-b">
            <button
              type="button"
              className="pw-label"
              aria-expanded={!!open[i]}
              onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", background: "transparent", border: 0, padding: "var(--space-4)", cursor: "pointer", textAlign: "left", color: "var(--color-text)" }}
            >
              <span>{q.question}</span>
              <span style={{ fontFamily: "ui-monospace, monospace", color: "var(--color-accent)" }}>{open[i] ? "−" : "+"}</span>
            </button>
            {open[i] && <p style={{ margin: 0, padding: "0 var(--space-4) var(--space-4)", maxWidth: "56ch" }}>{q.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
