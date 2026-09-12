import type { InquiryStatus } from "@/generated/prisma/enums";

// Admin-facing labels for the inquiry workflow (PRD 4.3): 신규 → 상담중 → 구매완료 / 보류 / 스팸
export const STATUS_LABEL: Record<InquiryStatus, string> = {
  NEW: "신규",
  IN_PROGRESS: "상담중",
  DONE: "구매완료",
  HOLD: "보류",
  SPAM: "스팸",
};

export const STATUS_ORDER: InquiryStatus[] = ["NEW", "IN_PROGRESS", "DONE", "HOLD", "SPAM"];

export function isInquiryStatus(v: unknown): v is InquiryStatus {
  return typeof v === "string" && (STATUS_ORDER as string[]).includes(v);
}

export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length < 4) return d;
  if (d.length < 8) return d.slice(0, 3) + "-" + d.slice(3);
  return d.slice(0, 3) + "-" + d.slice(3, d.length - 4) + "-" + d.slice(d.length - 4);
}

export function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "Asia/Seoul",
  }).format(d);
}
