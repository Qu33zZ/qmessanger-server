-- CreateTable
CREATE TABLE "_readBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_readBy_AB_unique" ON "_readBy"("A", "B");

-- CreateIndex
CREATE INDEX "_readBy_B_index" ON "_readBy"("B");

-- AddForeignKey
ALTER TABLE "_readBy" ADD CONSTRAINT "_readBy_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_readBy" ADD CONSTRAINT "_readBy_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
