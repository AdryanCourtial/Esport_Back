/*
  Warnings:

  - You are about to drop the column `players` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tournament_results` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentTypeId` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the `tournament_registrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tournament_types` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamId]` on the table `tournament_results` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentId,teamId]` on the table `tournament_results` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `captainId` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentId` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `tournament_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tournament_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `teams` DROP FOREIGN KEY `teams_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tournament_registrations` DROP FOREIGN KEY `tournament_registrations_TournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `tournament_registrations` DROP FOREIGN KEY `tournament_registrations_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tournament_results` DROP FOREIGN KEY `tournament_results_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tournaments` DROP FOREIGN KEY `tournaments_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `tournaments` DROP FOREIGN KEY `tournaments_tournamentTypeId_fkey`;

-- AlterTable
ALTER TABLE `teams` DROP COLUMN `players`,
    DROP COLUMN `userId`,
    ADD COLUMN `captainId` VARCHAR(191) NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('INCOMPLETE', 'COMPLETE', 'DISBANDED') NOT NULL DEFAULT 'INCOMPLETE',
    ADD COLUMN `tournamentId` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tournament_results` DROP COLUMN `userId`,
    ADD COLUMN `rank` INTEGER NULL,
    ADD COLUMN `teamId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `score` INTEGER NULL;

-- AlterTable
ALTER TABLE `tournaments` DROP COLUMN `teamId`,
    DROP COLUMN `tournamentTypeId`,
    ADD COLUMN `maxPlayers` INTEGER NOT NULL DEFAULT 16,
    ADD COLUMN `playersPerTeam` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `tournament_registrations`;

-- DropTable
DROP TABLE `tournament_types`;

-- CreateTable
CREATE TABLE `team_members` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `team_members_teamId_userId_key`(`teamId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `tournament_results_teamId_key` ON `tournament_results`(`teamId`);

-- CreateIndex
CREATE UNIQUE INDEX `tournament_results_tournamentId_teamId_key` ON `tournament_results`(`tournamentId`, `teamId`);

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tournament_results` ADD CONSTRAINT `tournament_results_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
