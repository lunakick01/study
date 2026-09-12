"use client";

import { useActionState, useState } from "react";
import type { InquiryStatus } from "@/generated/prisma/enums";
import { STATUS_LABEL, STATUS_ORDER, formatPhone } from "@/lib/inquiry-status";
import { addMemo, updateStatus } from "@/app/admin/(dashboard)/inquiries/actions";

// Interactive bits of the inquiry detail page: call/copy phone, status buttons, memo form.

export function PhoneActions({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("번호를 복사하세요", phone);
    }
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <a href={`tel:${phone}`} style={{ fontWeight: 600 }}>{formatPhone(phone)}</a>
      <a href={`tel:${phone}`} className="btn btn-primary btn-sm">전화걸기</a>
      <button type="button" className="btn btn-secondary btn-sm" onClick={copy}>{copied ? "복사됨" : "번호 복사"}</button>
    </span>
  );
}

export function StatusButtons({ id, current }: { id: string; current: InquiryStatus }) {
  const [state, action, pending] = useActionState(updateStatus, null);
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <input type="hidden" name="id" value={id} />
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            type="submit"
            name="status"
            value={s}
            disabled={pending || s === current}
            className={`btn ${s === current ? "btn-primary is-active" : "btn-secondary"}`}
            aria-pressed={s === current}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      {state?.error && <div className="field-error" style={{ marginTop: 0 }}>{state.error}</div>}
    </form>
  );
}

export function MemoForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(addMemo, null);
  return (
    // React 19 resets the (uncontrolled) fields itself once the action succeeds
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <input type="hidden" name="id" value={id} />
      <div className="field">
        <label htmlFor="memo">메모 추가</label>
        <textarea className="input" id="memo" name="content" rows={3} maxLength={2000} placeholder="통화 내용, 안내한 사항, 다음 할 일 등" required />
      </div>
      {state?.error && <div className="field-error" style={{ marginTop: 0 }}>{state.error}</div>}
      <button type="submit" className="btn btn-primary" disabled={pending} style={{ alignSelf: "flex-start" }}>{pending ? "저장 중…" : "메모 저장"}</button>
    </form>
  );
}
