-- AlterEnum
BEGIN;
CREATE TYPE "InquiryStatus_new" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'HOLD', 'SPAM');
ALTER TABLE "public"."Inquiry" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Inquiry" ALTER COLUMN "status" TYPE "InquiryStatus_new" USING ("status"::text::"InquiryStatus_new");
ALTER TYPE "InquiryStatus" RENAME TO "InquiryStatus_old";
ALTER TYPE "InquiryStatus_new" RENAME TO "InquiryStatus";
DROP TYPE "public"."InquiryStatus_old";
ALTER TABLE "Inquiry" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- DropForeignKey
ALTER TABLE "InquiryReply" DROP CONSTRAINT "InquiryReply_inquiryId_fkey";

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "viewedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'NEW';

-- DropTable
DROP TABLE "InquiryReply";

-- CreateTable
CREATE TABLE "InquiryMemo" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryMemo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InquiryMemo_inquiryId_createdAt_idx" ON "InquiryMemo"("inquiryId", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_deletedAt_viewedAt_idx" ON "Inquiry"("deletedAt", "viewedAt");

-- AddForeignKey
ALTER TABLE "InquiryMemo" ADD CONSTRAINT "InquiryMemo_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

