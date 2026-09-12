import "server-only";
import { createClient } from "@supabase/supabase-js";

// service_role 키 사용 - 서버 전용 (관리자 계정 생성, RLS 우회 작업 등)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
