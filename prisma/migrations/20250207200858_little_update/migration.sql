-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tournamentTypeId" TEXT NOT NULL,
    "registrationStart" DATETIME,
    "registrationEnd" DATETIME,
    "tournamentDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tournament_tournamentTypeId_fkey" FOREIGN KEY ("tournamentTypeId") REFERENCES "TournamentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("createdAt", "description", "id", "name", "registrationEnd", "registrationStart", "tournamentDate", "tournamentTypeId", "updatedAt") SELECT "createdAt", "description", "id", "name", "registrationEnd", "registrationStart", "tournamentDate", "tournamentTypeId", "updatedAt" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
