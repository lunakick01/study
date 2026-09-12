import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MemoForm, PhoneActions, StatusButtons } from "@/components/admin/InquiryTools";
import { formatDateTime } from "@/lib/inquiry-status";

export default async function InquiryDetailPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findFirst({
    where: { id, deletedAt: null },
    include: { memos: { orderBy: { createdAt: "desc" } } },
  });
  if (!inquiry) notFound();

  // Opening the detail marks it "viewed" — the status itself stays manual (PRD 5)
  if (!inquiry.viewedAt) {
    await prisma.inquiry.update({ where: { id }, data: { viewedAt: new Date() } });
  }

  const rows: [string, React.ReactNode][] = [
    ["접수일시", formatDateTime(inquiry.createdAt)],
    ["이름", inquiry.customerName],
    ["연락처", <PhoneActions key="phone" phone={inquiry.phone} />],
    ["이메일", inquiry.email ? <a key="mail" href={`mailto:${inquiry.email}`}>{inquiry.email}</a> : "—"],
    ["관심 상품", inquiry.productName ?? "—"],
    ["희망 사이즈", inquiry.size ?? "—"],
    ["수량", String(inquiry.quantity)],
    ["연락 희망 시간대", inquiry.contactTime ?? "—"],
    ["유입 경로", inquiry.referral ?? "—"],
    ["IP", inquiry.ipAddress ?? "—"],
    ["기기", inquiry.userAgent ?? "—"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <Link href="/admin/inquiries" className="pw-eyebrow" style={{ textDecoration: "none", color: "var(--color-accent-700)" }}>← 문의 목록</Link>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 26 }}>{inquiry.customerName}</h1>
          <StatusBadge status={inquiry.status} />
          {!inquiry.viewedAt && <span className="text-muted" style={{ fontSize: 12 }}>방금 확인함</span>}
        </div>
      </div>

      <section style={{ display: "grid", gap: "var(--space-6)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <h2 style={{ margin: "0 0 var(--space-2)", fontSize: 16 }}>문의 내용</h2>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", background: "var(--color-surface)", padding: "var(--space-3)" }}>{inquiry.message}</p>
          </div>
          <div>
            <h2 style={{ margin: "0 0 var(--space-2)", fontSize: 16 }}>고객 정보</h2>
            <dl className="dl">
              {rows.map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <h2 style={{ margin: "0 0 var(--space-2)", fontSize: 16 }}>상태 변경</h2>
            <StatusButtons id={inquiry.id} current={inquiry.status} />
            <p className="text-muted" style={{ margin: "var(--space-2) 0 0", fontSize: 12 }}>신규 → 상담중 → 구매완료 / 보류 / 스팸. 자동으로 바뀌지 않아요.</p>
          </div>
          <div>
            <h2 style={{ margin: "0 0 var(--space-2)", fontSize: 16 }}>관리자 메모</h2>
            <MemoForm id={inquiry.id} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
              {inquiry.memos.length === 0 && <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>아직 메모가 없어요.</p>}
              {inquiry.memos.map((m) => (
                <div key={m.id} className="card" style={{ gap: 4 }}>
                  <div className="text-muted" style={{ fontSize: 11 }}>{formatDateTime(m.createdAt)}{m.author ? ` · ${m.author}` : ""}</div>
                  <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
