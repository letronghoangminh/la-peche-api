-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_secondUsername_fk`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `phoneNumber` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `match` ADD CONSTRAINT `match_secondUsername_fk` FOREIGN KEY (`secondUsername`) REFERENCES `user`(`username`) ON DELETE CASCADE ON UPDATE NO ACTION;
