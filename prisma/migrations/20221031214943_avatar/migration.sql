-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
