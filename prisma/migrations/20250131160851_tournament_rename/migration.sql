/*
  Warnings:

  - You are about to drop the column `TournamentTypeId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `TournamentId` on the `TournamentResult` table. All the data in the column will be lost.
  - Added the required column `tournamentTypeId` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentId` to the `TournamentResult` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tournamentTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tournament_tournamentTypeId_fkey" FOREIGN KEY ("tournamentTypeId") REFERENCES "TournamentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE TABLE "new_TournamentResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TournamentResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TournamentResult_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TournamentResult" ("createdAt", "id", "score", "userId") SELECT "createdAt", "id", "score", "userId" FROM "TournamentResult";
DROP TABLE "TournamentResult";
ALTER TABLE "new_TournamentResult" RENAME TO "TournamentResult";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
