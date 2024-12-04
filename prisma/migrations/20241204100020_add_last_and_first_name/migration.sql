/*
  Warnings:

  - Added the required column `FirstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
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
    "LastName" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL
);
INSERT INTO "new_User" ("accentColor", "avatar", "bannerColor", "createdAt", "discordId", "discriminator", "flags", "globalName", "id", "locale", "mfaEnabled", "premiumType", "publicFlags", "updatedAt", "username") SELECT "accentColor", "avatar", "bannerColor", "createdAt", "discordId", "discriminator", "flags", "globalName", "id", "locale", "mfaEnabled", "premiumType", "publicFlags", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
