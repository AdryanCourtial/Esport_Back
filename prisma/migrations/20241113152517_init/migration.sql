-- CreateTable
CREATE TABLE "User" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
