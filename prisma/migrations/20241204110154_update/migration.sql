-- AlterTable
ALTER TABLE "Sector" ADD COLUMN "userId" TEXT;

-- CreateTable
CREATE TABLE "_UserSector" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserSector_A_fkey" FOREIGN KEY ("A") REFERENCES "Sector" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserSector_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserSector_AB_unique" ON "_UserSector"("A", "B");

-- CreateIndex
CREATE INDEX "_UserSector_B_index" ON "_UserSector"("B");
