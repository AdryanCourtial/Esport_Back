/*
  Warnings:

  - You are about to drop the `_UserSector` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Sector` table. All the data in the column will be lost.
  - You are about to drop the column `FirstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_UserSector_B_index";

-- DropIndex
DROP INDEX "_UserSector_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserSector";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Name" TEXT NOT NULL
);
INSERT INTO "new_Sector" ("Name", "id") SELECT "Name", "id" FROM "Sector";
DROP TABLE "Sector";
ALTER TABLE "new_Sector" RENAME TO "Sector";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT,
    "globalName" TEXT,
    "accentColor" INTEGER,
    "bannerColor" TEXT,
    "locale" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL,
    "premiumType" INTEGER,
    "publicFlags" INTEGER,
    "flags" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "sectorId" TEXT,
    CONSTRAINT "User_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("accentColor", "avatar", "bannerColor", "createdAt", "discordId", "discriminator", "flags", "globalName", "id", "locale", "mfaEnabled", "premiumType", "publicFlags", "updatedAt", "username") SELECT "accentColor", "avatar", "bannerColor", "createdAt", "discordId", "discriminator", "flags", "globalName", "id", "locale", "mfaEnabled", "premiumType", "publicFlags", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
