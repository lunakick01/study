import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const products = [
    { name: "오버핏 울 코트", slug: "oversized-wool-coat", price: 189000, category: "아우터", sortOrder: 1 },
    { name: "코튼 크루넥 티셔츠", slug: "cotton-crewneck-tee", price: 29000, category: "상의", sortOrder: 2 },
    { name: "와이드 데님 팬츠", slug: "wide-denim-pants", price: 69000, category: "하의", sortOrder: 3 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, description: `${p.name} 상품 설명 (샘플)` },
    });
  }

  console.log(`seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
