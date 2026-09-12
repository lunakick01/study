"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// useSearchParams needs a Suspense boundary so the page can still be prerendered
export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message.includes("Invalid login") ? "이메일 또는 비밀번호가 맞지 않습니다." : error.message);
      return;
    }
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "var(--space-4)" }}>
      <form onSubmit={onSubmit} className="pw-border-t" style={{ width: "min(360px, 100%)", display: "flex", flexDirection: "column", gap: "var(--space-4)", paddingTop: "var(--space-6)" }}>
        <div>
          <div className="pw-eyebrow pw-eyebrow-wide" style={{ color: "var(--color-accent-700)" }}>Admin</div>
          <h1 style={{ margin: "var(--space-2) 0 0", fontSize: 28 }}>PLAINWORK 관리자</h1>
        </div>
        <div className="field">
          <label htmlFor="email">이메일</label>
          <input className="input" id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input className="input" id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="field-error" style={{ marginTop: 0 }}>{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? "확인 중…" : "로그인"}</button>
        <p className="text-muted" style={{ margin: 0, fontSize: 12 }}>계정은 운영자에게 발급받으세요. 가입 기능은 없습니다.</p>
      </form>
    </main>
  );
}
