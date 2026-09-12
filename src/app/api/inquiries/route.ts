import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blankToNull, inquiryInputSchema } from "@/lib/inquiry";

// POST /api/inquiries — receives the landing-page form and stores an Inquiry row.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = inquiryInputSchema.safeParse(body);
  if (!parsed.success) {
    // First message per field — the form shows them under the matching input
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json({ error: "입력값을 확인해 주세요.", errors }, { status: 400 });
  }

  const d = parsed.data;
  if (d.website) {
    // Honeypot filled in — a bot. Pretend it worked so it stops trying.
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        customerName: d.name,
        phone: d.phone,
        email: d.email || null,
        productName: blankToNull(d.product),
        size: blankToNull(d.size),
        quantity: d.qty,
        contactTime: blankToNull(d.time),
        referral: blankToNull(d.referral),
        message: d.message,
        // Submission context for the admin detail view (PRD 4.3)
        ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null,
        userAgent: req.headers.get("user-agent")?.slice(0, 500) || null,
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json({ error: "접수 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
