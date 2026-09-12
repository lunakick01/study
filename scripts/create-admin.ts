import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// Creates (or resets the password of) an admin login. There is no public sign-up.
// Usage: npm run admin:create -- <email> <password>

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("사용법: npm run admin:create -- <이메일> <비밀번호>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("비밀번호는 8자 이상이어야 합니다.");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function main() {
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });
    if (error) throw error;
    console.log(`비밀번호를 변경했습니다: ${email}`);
    return;
  }

  const { error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  console.log(`관리자 계정을 만들었습니다: ${email}`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
