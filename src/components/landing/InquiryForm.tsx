"use client";

import { useMemo, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import { PRODUCTS, REFERRAL_OPTIONS, SIZE_OPTIONS, TIME_OPTIONS } from "@/content/landing";
import { useInquiry } from "./InquiryContext";

// `product` lives in InquiryContext so the grid / look buttons can preselect it.
type Form = {
  name: string;
  phone: string;
  email: string;
  size: string;
  qty: number;
  message: string;
  time: string;
  referral: string;
  website: string; // honeypot — bots fill it, humans never see it
  agree: boolean;
};

const EMPTY: Form = {
  name: "", phone: "", email: "", size: "선택 안 함", qty: 1,
  message: "", time: "상관없음", referral: "선택 안 함", website: "", agree: false,
};

const DRAFT_KEY = "plainwork_inquiry_draft_v2";

// Unfinished draft for this browser tab. Read as an external store so the
// server render (no storage) and the client render stay in sync without an effect.
const noopSubscribe = () => () => {};
function readDraft() {
  try { return sessionStorage.getItem(DRAFT_KEY); } catch { return null; }
}
function useDraft(): Partial<Form> | null {
  const raw = useSyncExternalStore(noopSubscribe, readDraft, () => null);
  return useMemo(() => {
    if (!raw) return null;
    try { return JSON.parse(raw) as Partial<Form>; } catch { return null; }
  }, [raw]);
}

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return d.slice(0, 3) + "-" + d.slice(3);
  return d.slice(0, 3) + "-" + d.slice(3, d.length - 4) + "-" + d.slice(d.length - 4);
}

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  const name = f.name.trim();
  if (name.length < 2 || name.length > 20) e.name = "이름을 2~20자로 입력해 주세요.";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 11) e.phone = "연락처를 숫자 9~11자리로 입력해 주세요.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "이메일 형식을 확인해 주세요.";
  if (f.message.trim().length < 5) e.message = "문의 내용을 5자 이상 입력해 주세요.";
  if (f.message.length > 1000) e.message = "문의 내용은 1000자 이내로 입력해 주세요.";
  if (!f.agree) e.agree = "개인정보 수집·이용에 동의해 주세요.";
  return e;
}

export function InquirySection() {
  const { selectedProduct, setSelectedProduct, jumpSeq } = useInquiry();
  const draft = useDraft();
  // `null` until the visitor types — until then the saved draft (if any) is shown
  const [edited, setEdited] = useState<Form | null>(null);
  const form: Form = edited ?? { ...EMPTY, ...draft, agree: false };
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The success panel is tied to the jump counter, so clicking "이 상품 문의" reopens the form
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);
  const submitted = submittedAt === jumpSeq;

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    const next = { ...form, [key]: value };
    setEdited(next);
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...next, agree: undefined, website: undefined }));
    } catch {}
    setErrors((e) => {
      const rest = { ...e };
      delete rest[key];
      return rest;
    });
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (submitting) return;
    if (form.website) return; // honeypot hit
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    setErrors({});
    setSubmitError(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: selectedProduct }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Record<string, string> };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setSubmitError(data.error ?? "접수 중 문제가 생겼습니다.");
        return;
      }
      setSubmittedAt(jumpSeq);
      try { sessionStorage.removeItem(DRAFT_KEY); } catch {}
    } catch {
      setSubmitError("네트워크 오류로 접수하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setEdited(EMPTY);
    setSelectedProduct("");
    setErrors({});
    setSubmittedAt(null);
  }

  return (
    <section id="inquiry" className="pw-border-b pw-grid-auto" style={{ "--pw-min": "320px" } as CSSProperties}>
      <div className="pw-border-r" style={{ padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="pw-eyebrow pw-eyebrow-wide" style={{ color: "var(--color-accent-700)" }}>Inquiry</div>
        <h2 style={{ margin: 0, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.06, maxWidth: "18ch" }}>필요한 것만 남겨주세요</h2>
        <p style={{ margin: 0, maxWidth: "38ch" }}>사이즈·재입고·배송 무엇이든 됩니다. 영업일 기준 1일 이내에 남겨주신 연락처로 답변드립니다.</p>
        <div className="pw-border-t" style={{ paddingTop: "var(--space-4)", fontSize: 13 }}>
          <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-1) 0" }}><span className="text-muted" style={{ minWidth: 88 }}>응답 시간</span><span>평일 10:00–18:00</span></div>
          <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-1) 0" }}><span className="text-muted" style={{ minWidth: 88 }}>대체 연락</span><span>인스타 DM · 카카오채널</span></div>
        </div>
      </div>

      <div style={{ padding: "var(--space-8) var(--space-4)" }}>
        {submitted ? (
          <div style={{ border: "2px solid var(--color-accent)", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)", alignItems: "flex-start" }}>
            <h3 style={{ margin: 0, fontSize: 20 }}>문의가 접수되었습니다</h3>
            <p style={{ margin: 0 }}>영업일 기준 1일 이내 연락드립니다.</p>
            <button type="button" className="btn btn-secondary" onClick={reset}>문의 하나 더 남기기</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: "var(--space-4)", alignContent: "start" }}>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="v2-name">이름 *</label>
              <input className="input" id="v2-name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="2~20자" />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>
            <div className="field">
              <label htmlFor="v2-phone">연락처 *</label>
              <input className="input" id="v2-phone" type="tel" inputMode="numeric" value={form.phone} onChange={(e) => set("phone", formatPhone(e.target.value))} placeholder="010-0000-0000" />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>
            <div className="field">
              <label htmlFor="v2-email">이메일</label>
              <input className="input" id="v2-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="선택" />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="v2-product">관심 상품</label>
              <select className="input" id="v2-product" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">선택 안 함</option>
                {PRODUCTS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="v2-size">희망 사이즈</label>
              <select className="input" id="v2-size" value={form.size} onChange={(e) => set("size", e.target.value)}>
                {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="v2-qty">수량</label>
              <input className="input" id="v2-qty" type="number" min={1} max={99} value={form.qty} onChange={(e) => set("qty", Math.max(1, Math.min(99, Number(e.target.value) || 1)))} />
            </div>
            <div className="field">
              <label htmlFor="v2-time">연락 희망 시간대</label>
              <select className="input" id="v2-time" value={form.time} onChange={(e) => set("time", e.target.value)}>
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="v2-message">문의 내용 *</label>
              <textarea className="input" id="v2-message" rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="사이즈, 재입고, 배송 등 5자 이상" />
              {errors.message && <div className="field-error">{errors.message}</div>}
            </div>
            <div className="field">
              <label htmlFor="v2-referral">유입 경로</label>
              <select className="input" id="v2-referral" value={form.referral} onChange={(e) => set("referral", e.target.value)}>
                {REFERRAL_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
            <div className="pw-border-t" style={{ gridColumn: "1 / -1", paddingTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} style={{ marginTop: 3, accentColor: "var(--color-accent)" }} />
                <span>이름·연락처·문의 내용을 문의 응대 목적으로 수집하는 것에 동의합니다. 보관 후 1년 뒤 파기됩니다. *</span>
              </label>
              {errors.agree && <div className="field-error" style={{ marginTop: 0 }}>{errors.agree}</div>}
              {submitError && (
                <div style={{ border: "1px solid var(--color-accent)", padding: "var(--space-3)", fontSize: 13 }}>
                  {submitError} 인스타 DM 또는 카카오채널로 연락해 주세요.
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ alignSelf: "flex-start" }}>
                {submitting ? "접수 중…" : "문의 남기기"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
