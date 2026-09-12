import type { InquiryStatus } from "@/generated/prisma/enums";
import { STATUS_LABEL } from "@/lib/inquiry-status";

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return <span className={`status status-${status}`}>{STATUS_LABEL[status]}</span>;
}
