import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { STATUS_LABEL, STATUS_ORDER, formatDateTime, formatPhone, isInquiryStatus } from "@/lib/inquiry-status";

const PAGE_SIZE = 20;

type Search = { status?: string; q?: string; from?: string; to?: string; page?: string; unviewed?: string };

function seoulDate(s: string | undefined, endOfDay = false) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  // YYYY-MM-DD typed by a Korean admin means Asia/Seoul (UTC+9)
  return new Date(`${s}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+09:00`);
}

export default async function InquiryListPage({ searchParams }: PageProps<"/admin/inquiries">) {
  const sp = (await searchParams) as Search;
  const status = isInquiryStatus(sp.status) ? sp.status : undefined;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);
  const from = seoulDate(sp.from);
  const to = seoulDate(sp.to, true);
  const unviewedOnly = sp.unviewed === "1";

  const where: Prisma.InquiryWhereInput = {
    deletedAt: null,
    ...(status && { status }),
    ...(unviewedOnly && { viewedAt: null }),
    ...((from || to) && { createdAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }),
    ...(q && {
      OR: [
        { customerName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q.replace(/\D/g, "") || q } },
        { productName: { contains: q, mode: "insensitive" } },
      ],
    }),
  };

  const [total, rows, counts] = await Promise.all([
    prisma.inquiry.count({ where }),
    prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.inquiry.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const allCount = counts.reduce((n, c) => n + c._count._all, 0);

  // Keeps the other filters when one changes
  const href = (patch: Partial<Search>) => {
    const p = new URLSearchParams();
    const merged = { ...sp, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    const s = p.toString();
    return `/admin/inquiries${s ? `?${s}` : ""}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>문의 관리</h1>
        <span className="text-muted" style={{ fontSize: 13 }}>{total}건 · {page}/{pages} 페이지</span>
      </div>

      {/* status tabs */}
      <div className="pw-eyebrow" style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", borderBottom: "2px solid var(--color-divider)", paddingBottom: "var(--space-2)" }}>
        <Link href={href({ status: undefined, page: undefined, unviewed: undefined })} style={{ textDecoration: "none", color: !status && !unviewedOnly ? "var(--color-accent)" : undefined }}>전체 {allCount}</Link>
        <Link href={href({ status: undefined, unviewed: "1", page: undefined })} style={{ textDecoration: "none", color: unviewedOnly ? "var(--color-accent)" : undefined }}>미확인</Link>
        {STATUS_ORDER.map((s) => (
          <Link key={s} href={href({ status: s, unviewed: undefined, page: undefined })} style={{ textDecoration: "none", color: status === s ? "var(--color-accent)" : undefined }}>
            {STATUS_LABEL[s]} {countOf(s)}
          </Link>
        ))}
      </div>

      {/* search + date range (plain GET form so it works without JS) */}
      <form method="get" style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "flex-end" }}>
        {status && <input type="hidden" name="status" value={status} />}
        {unviewedOnly && <input type="hidden" name="unviewed" value="1" />}
        <div className="field" style={{ flex: "1 1 200px" }}>
          <label htmlFor="q">이름 · 연락처 · 상품</label>
          <input className="input" id="q" name="q" defaultValue={q} placeholder="검색어" />
        </div>
        <div className="field">
          <label htmlFor="from">시작일</label>
          <input className="input" id="from" name="from" type="date" defaultValue={sp.from ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="to">종료일</label>
          <input className="input" id="to" name="to" type="date" defaultValue={sp.to ?? ""} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ minHeight: 36 }}>검색</button>
        {(q || sp.from || sp.to) && <Link href={href({ q: undefined, from: undefined, to: undefined, page: undefined })} className="btn btn-secondary" style={{ minHeight: 36 }}>초기화</Link>}
      </form>

      {rows.length === 0 ? (
        <p className="text-muted">조건에 맞는 문의가 없어요.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>접수일시</th><th>이름</th><th>연락처</th><th>관심 상품</th><th>사이즈/수량</th><th>상태</th><th>메모</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: "nowrap" }}><Link href={`/admin/inquiries/${r.id}`}>{formatDateTime(r.createdAt)}</Link></td>
                  <td style={{ fontWeight: r.viewedAt ? 400 : 600, whiteSpace: "nowrap" }}>
                    <Link href={`/admin/inquiries/${r.id}`} style={{ textDecoration: "none" }}>
                      {!r.viewedAt && <span aria-label="미확인" style={{ display: "inline-block", width: 6, height: 6, background: "var(--color-accent)", marginRight: 6, verticalAlign: "middle" }} />}
                      {r.customerName}
                    </Link>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}><a href={`tel:${r.phone}`}>{formatPhone(r.phone)}</a></td>
                  <td>{r.productName ?? <span className="text-muted">—</span>}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{r.size ?? "—"} / {r.quantity}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="text-muted" style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "center", alignItems: "center" }}>
          {page > 1 && <Link href={href({ page: String(page - 1) })} className="btn btn-secondary btn-sm">← 이전</Link>}
          <span className="text-muted" style={{ fontSize: 13 }}>{page} / {pages}</span>
          {page < pages && <Link href={href({ page: String(page + 1) })} className="btn btn-secondary btn-sm">다음 →</Link>}
        </div>
      )}
    </div>
  );
}
