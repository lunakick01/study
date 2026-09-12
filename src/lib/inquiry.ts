import { z } from "zod";

// Server-side rules for an inquiry submission. Mirrors the checks the landing
// form runs in the browser — the browser copy is for instant feedback, this one is trusted.
export const inquiryInputSchema = z.object({
  name: z.string().trim().min(2, "이름을 2~20자로 입력해 주세요.").max(20, "이름을 2~20자로 입력해 주세요."),
  phone: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((d) => d.length >= 9 && d.length <= 11, "연락처를 숫자 9~11자리로 입력해 주세요."),
  email: z.union([z.literal(""), z.string().email("이메일 형식을 확인해 주세요.")]).optional(),
  product: z.string().max(100).optional(),
  size: z.string().max(20).optional(),
  qty: z.coerce.number().int().min(1).max(99).default(1),
  time: z.string().max(20).optional(),
  referral: z.string().max(20).optional(),
  message: z.string().trim().min(5, "문의 내용을 5자 이상 입력해 주세요.").max(1000, "문의 내용은 1000자 이내로 입력해 주세요."),
  agree: z.literal(true, { error: "개인정보 수집·이용에 동의해 주세요." }),
  website: z.string().max(0).optional(), // honeypot — must stay empty
});

export type InquiryInput = z.infer<typeof inquiryInputSchema>;

const NONE = "선택 안 함";
const ANY = "상관없음";

// Turn "선택 안 함" / "상관없음" style defaults into NULL so the DB stays clean
export function blankToNull(value: string | undefined) {
  if (!value || value === NONE || value === ANY) return null;
  return value;
}
