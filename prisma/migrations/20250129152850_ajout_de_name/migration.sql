/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "email" TEXT NOT NULL,
    "sectorId" TEXT,
    CONSTRAINT "User_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("accentColor", "avatar", "bannerColor", "createdAt", "discordId", "discriminator", "firstName", "flags", "globalName", "id", "lastName", "locale", "mfaEnabled", "premiumType", "publicFlags", "sectorId", "updatedAt", "username") SELECT "accentColor", "avatar", "bannerColor", "createdAt", "discordId", "discriminator", "firstName", "flags", "globalName", "id", "lastName", "locale", "mfaEnabled", "premiumType", "publicFlags", "sectorId", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
