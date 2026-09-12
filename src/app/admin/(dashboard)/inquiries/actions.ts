"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isInquiryStatus } from "@/lib/inquiry-status";

export type ActionState = { ok?: boolean; error?: string } | null;

// Status is changed by hand only — never auto-advanced (PRD 5, 상태 전이 규칙)
export async function updateStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status");
  if (!id || !isInquiryStatus(status)) return { error: "잘못된 요청입니다." };

  await prisma.inquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function addMemo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  if (!id) return { error: "잘못된 요청입니다." };
  if (content.length < 1 || content.length > 2000) return { error: "메모는 1~2000자로 입력해 주세요." };

  await prisma.inquiryMemo.create({ data: { inquiryId: id, content, author: user.email ?? null } });
  revalidatePath(`/admin/inquiries/${id}`);
  return { ok: true };
}
