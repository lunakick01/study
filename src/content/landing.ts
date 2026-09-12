// Landing page copy — ported from the Claude Design "Landing v2" artboard.
// Product data is static for now; the Prisma Product table takes over later.

export type Product = {
  name: string;
  subtitle: string;
  price: number;
  badge: string;
  shot: string;
};

export const PRODUCTS: Product[] = [
  { name: "옥스퍼드 셔츠", subtitle: "두 번 빨아도 형태가 남는 40수 원단", price: 68000, badge: "BEST", shot: "상품컷 01" },
  { name: "헤비웨이트 티셔츠", subtitle: "300g 코마사, 목단 늘어짐 보강", price: 39000, badge: "NEW", shot: "상품컷 02" },
  { name: "와이드 치노 팬츠", subtitle: "밑단 수선 전제, 앉았을 때 여유", price: 89000, badge: "", shot: "상품컷 03" },
  { name: "램스울 크루넥 니트", subtitle: "가볼 없는 램스울 100%", price: 128000, badge: "BEST", shot: "상품컷 04" },
  { name: "코치 재킷", subtitle: "봄·가을 아웃터 한 벌", price: 158000, badge: "", shot: "상품컷 05" },
  { name: "데님 5포켓 팬츠", subtitle: "13oz, 물빠짐 적은 원단", price: 98000, badge: "", shot: "상품컷 06" },
  { name: "스웨트 후디", subtitle: "기모 없는 사계절 두께", price: 79000, badge: "SOLD OUT", shot: "상품컷 07" },
  { name: "라운지 셋업 셔츠", subtitle: "집에서도 밖에서도", price: 72000, badge: "", shot: "상품컷 08" },
];

// "Shop the look" picks 4 of the products by index
export const LOOK_INDEXES = [0, 2, 3, 4];

export const FAQS = [
  { question: "사이즈는 어떻게 고르면 되나요?", answer: "상품별 실측 사이즈를 문의 시 함께 안내드립니다. 평소 입는 브랜드와 사이즈를 남겨주시면 그 기준으로 추천드립니다." },
  { question: "교환·반품이 되나요?", answer: "수령 후 7일 이내, 착용·세탁 전이라면 가능합니다. 단순 변심은 왕복 배송비가 발생합니다." },
  { question: "배송은 얼마나 걸리나요?", answer: "재고가 있는 품목은 결제 확인 후 1~2영업일 내 출고됩니다. 재입고 예약 품목은 예상 일정을 개별 안내드립니다." },
  { question: "결제는 어떻게 하나요?", answer: "현재는 문의 후 개별 안내되는 계좌 입금으로 진행합니다. 카드 결제는 준비 중입니다." },
  { question: "품절된 상품은 재입고되나요?", answer: "상시 판매 8품목은 모두 재입고됩니다. 원하는 사이즈를 문의로 남겨주시면 입고 시 먼저 연락드립니다." },
];

export const MARQUEE = ["10만원 이상 무료배송", "재입고 알림 신청 가능", "영업일 1일 내 문의 답변", "사이즈 추천 상담"];

export const MOSAIC = [
  { label: "셔츠", shot: "착용컷 — 셔츠" },
  { label: "니트", shot: "디테일 — 니트 조직" },
];

export const PILLARS = [
  { title: "8품목만 만듭니다", body: "시즌마다 품목을 늘리지 않고 같은 옷의 패턴을 고칩니다." },
  { title: "국내 봉제", body: "원단 검단부터 봉제까지 직접 확인한 공장에서만 진행합니다." },
  { title: "재입고 우선 안내", body: "품절 사이즈를 문의로 남기면 입고 시 먼저 연락드립니다." },
];

export const REVIEWS = [
  { item: "옥스퍼드 셔츠", text: "한 달 입고 매주 빨았는데 칼라가 그대로 서 있습니다.", who: "30대 · L" },
  { item: "와이드 치노 팬츠", text: "통이 넓은데 밑단이 지저분하게 끌리지 않아서 좋았습니다.", who: "20대 · M" },
  { item: "램스울 크루넥 니트", text: "목 부분이 따갑지 않아서 이너 없이 입고 있습니다.", who: "40대 · L" },
];

export const STATS = [
  { value: "12,400장", label: "누적 판매" },
  { value: "38.2K", label: "인스타 팔로워" },
  { value: "41%", label: "재구매율" },
];

export const TILES = [
  { label: "사이즈 가이드", shot: "실측 이미지" },
  { label: "소재와 관리", shot: "원단 클로즈업" },
  { label: "재입고 안내", shot: "작업실 컷" },
];

export const SIZE_OPTIONS = ["선택 안 함", "S", "M", "L", "XL", "기타"];
export const TIME_OPTIONS = ["상관없음", "오전", "오후", "저녁"];
export const REFERRAL_OPTIONS = ["선택 안 함", "인스타그램", "검색", "지인 소개", "기타"];

export function formatPrice(price: number) {
  return price.toLocaleString("ko-KR") + "원";
}
