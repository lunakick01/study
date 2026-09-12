import type { Metadata } from "next";

// Shared by /admin/login and the protected dashboard. Keeps search engines out (PRD 4.1).
export const metadata: Metadata = {
  title: "관리자 — PLAINWORK",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>{children}</div>;
}
