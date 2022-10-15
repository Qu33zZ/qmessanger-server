-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "repliedToId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_repliedToId_fkey" FOREIGN KEY ("repliedToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
