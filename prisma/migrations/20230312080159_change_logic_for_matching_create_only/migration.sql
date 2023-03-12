/*
  Warnings:

  - You are about to drop the `match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_firstUsername_fk`;

-- DropForeignKey
ALTER TABLE `match` DROP FOREIGN KEY `match_secondUsername_fk`;

-- DropTable
DROP TABLE `match`;

-- CreateTable
CREATE TABLE `_user_match` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_match_AB_unique`(`A`, `B`),
    INDEX `_user_match_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_user_match` ADD CONSTRAINT `_user_match_A_fkey` FOREIGN KEY (`A`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_match` ADD CONSTRAINT `_user_match_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
