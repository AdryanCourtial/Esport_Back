-- DropForeignKey
ALTER TABLE `team_members` DROP FOREIGN KEY `team_members_teamId_fkey`;

-- AddForeignKey
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
