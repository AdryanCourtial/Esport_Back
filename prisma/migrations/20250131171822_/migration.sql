/*
  Warnings:

  - Added the required column `registrationEnd` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationStart` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDate` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tournamentTypeId" TEXT NOT NULL,
    "registrationStart" DATETIME NOT NULL,
    "registrationEnd" DATETIME NOT NULL,
    "tournamentDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tournament_tournamentTypeId_fkey" FOREIGN KEY ("tournamentTypeId") REFERENCES "TournamentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("createdAt", "description", "id", "name", "tournamentTypeId", "updatedAt") SELECT "createdAt", "description", "id", "name", "tournamentTypeId", "updatedAt" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
