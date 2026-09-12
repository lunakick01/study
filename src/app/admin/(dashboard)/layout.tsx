import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";

async function unviewedCount() {
  return prisma.inquiry.count({ where: { deletedAt: null, viewedAt: null, status: { not: "SPAM" } } });
}

// Browser tab shows "(3) 관리자" while there are unviewed inquiries (PRD 4.2)
export async function generateMetadata(): Promise<Metadata> {
  const n = await unviewedCount();
  return { title: n > 0 ? `(${n}) 관리자 — PLAINWORK` : "관리자 — PLAINWORK" };
}

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const unviewed = await unviewedCount();

  return (
    <>
      <header className="pw-border-b" style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--color-bg)" }}>
        <div className="admin-nav pw-eyebrow" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-3) var(--space-4)", flexWrap: "wrap" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <Link href="/admin" style={{ fontWeight: 800, letterSpacing: "0.04em", fontSize: 13 }}>PLAINWORK ADMIN</Link>
            <Link href="/admin">대시보드</Link>
            <Link href="/admin/inquiries" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              문의 {unviewed > 0 && <span className="badge-count">{unviewed}</span>}
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className="text-muted">사이트 보기 ↗</a>
          </nav>
          <form action={signOut} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span className="text-muted" style={{ textTransform: "none", letterSpacing: 0 }}>{user.email}</span>
            <button type="submit" className="btn btn-secondary btn-sm">로그아웃</button>
          </form>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </>
  );
}
