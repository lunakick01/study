import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, formatPhone } from "@/lib/inquiry-status";

// Start of "today" and "this week" (Monday) in Asia/Seoul, expressed as UTC instants
function seoulRanges() {
  const now = new Date();
  const seoul = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const offsetMs = seoul.getTime() - now.getTime();
  const dayStart = new Date(seoul); dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(dayStart); weekStart.setDate(dayStart.getDate() - ((dayStart.getDay() + 6) % 7));
  return { today: new Date(dayStart.getTime() - offsetMs), week: new Date(weekStart.getTime() - offsetMs) };
}

export default async function AdminDashboardPage() {
  const live = { deletedAt: null } as const;
  const { today, week } = seoulRanges();

  const [total, todayCount, weekCount, unviewed, recent, byProduct] = await Promise.all([
    prisma.inquiry.count({ where: live }),
    prisma.inquiry.count({ where: { ...live, createdAt: { gte: today } } }),
    prisma.inquiry.count({ where: { ...live, createdAt: { gte: week } } }),
    prisma.inquiry.count({ where: { ...live, viewedAt: null, status: { not: "SPAM" } } }),
    prisma.inquiry.findMany({ where: live, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.inquiry.groupBy({
      by: ["productName"],
      where: { ...live, productName: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { productName: "desc" } },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "오늘", value: todayCount },
    { label: "이번 주", value: weekCount },
    { label: "전체", value: total },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>대시보드</h1>
        <span className="text-muted" style={{ fontSize: 12 }}>{formatDateTime(new Date())} 기준</span>
      </div>

      <div className="admin-grid">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className="card-kicker">{s.label} 문의</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
        <Link href="/admin/inquiries?unviewed=1" className="card" style={{ textDecoration: "none", border: unviewed > 0 ? "2px solid var(--color-accent)" : undefined }}>
          <div className="card-kicker">미확인 문의</div>
          <div className="stat-value" style={{ color: unviewed > 0 ? "var(--color-accent)" : undefined }}>{unviewed}</div>
          <div className="text-muted" style={{ fontSize: 12 }}>{unviewed > 0 ? "확인이 필요해요 →" : "모두 확인했어요"}</div>
        </Link>
      </div>

      <section style={{ display: "grid", gap: "var(--space-6)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>최근 문의 5건</h2>
            <Link href="/admin/inquiries" className="pw-eyebrow" style={{ textDecoration: "none", color: "var(--color-accent-700)" }}>전체 보기 →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 14 }}>아직 접수된 문의가 없어요.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>접수</th><th>이름</th><th>연락처</th><th>상품</th><th>상태</th></tr></thead>
                <tbody>
                  {recent.map((q) => (
                    <tr key={q.id}>
                      <td style={{ whiteSpace: "nowrap" }}><Link href={`/admin/inquiries/${q.id}`}>{formatDateTime(q.createdAt)}</Link></td>
                      <td style={{ fontWeight: q.viewedAt ? 400 : 600 }}><Link href={`/admin/inquiries/${q.id}`} style={{ textDecoration: "none" }}>{q.customerName}</Link></td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatPhone(q.phone)}</td>
                      <td>{q.productName ?? <span className="text-muted">—</span>}</td>
                      <td><StatusBadge status={q.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 style={{ margin: "0 0 var(--space-2)", fontSize: 16 }}>상품별 문의 TOP 5</h2>
          {byProduct.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 14 }}>상품을 고른 문의가 아직 없어요.</p>
          ) : (
            <table className="table">
              <thead><tr><th>#</th><th>상품</th><th style={{ textAlign: "right" }}>문의 수</th></tr></thead>
              <tbody>
                {byProduct.map((row, i) => (
                  <tr key={row.productName}>
                    <td className="text-muted">{i + 1}</td>
                    <td><Link href={`/admin/inquiries?q=${encodeURIComponent(row.productName ?? "")}`} style={{ textDecoration: "none" }}>{row.productName}</Link></td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>{row._count._all}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
