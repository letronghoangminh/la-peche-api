-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hashedPassword` VARCHAR(191) NOT NULL,
    `cluster` INTEGER NULL,
    `isActivated` BOOLEAN NOT NULL DEFAULT true,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `verifyAt` DATETIME(0) NULL,
    `premiumEndsAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `introShownFields` JSON NOT NULL,
    `lastOnline` DATETIME(0) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `orientation` VARCHAR(191) NOT NULL,
    `biographic` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `yearOfBirth` INTEGER NULL,
    `bodyType` VARCHAR(191) NULL,
    `diet` VARCHAR(191) NULL,
    `drinks` VARCHAR(191) NULL,
    `drugs` VARCHAR(191) NULL,
    `education` VARCHAR(191) NULL,
    `ethnicity` VARCHAR(191) NULL,
    `height` DOUBLE NULL,
    `income` DOUBLE NULL,
    `job` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `offspring` VARCHAR(191) NULL,
    `pets` VARCHAR(191) NULL,
    `sign` VARCHAR(191) NULL,
    `smokes` VARCHAR(191) NULL,
    `speaks` VARCHAR(191) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `status` ENUM('READ', 'UNREAD', 'PINNED') NOT NULL DEFAULT 'UNREAD',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` INTEGER NOT NULL,

    INDEX `notification_userId_fk`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `discountPercent` DOUBLE NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `coupon_code_key`(`code`),
    INDEX `coupon_userId_fk`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `isThumbnail` BOOLEAN NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` INTEGER NOT NULL,

    INDEX `user_image_userId_fk`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `reporterId` INTEGER NOT NULL,
    `targetId` INTEGER NOT NULL,

    INDEX `report_reporterId_fk`(`reporterId`),
    INDEX `report_targetId_fk`(`targetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_user_likes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_likes_AB_unique`(`A`, `B`),
    INDEX `_user_likes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_user_stars` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_stars_AB_unique`(`A`, `B`),
    INDEX `_user_stars_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fk` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon` ADD CONSTRAINT `coupon_userId_fk` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_image` ADD CONSTRAINT `user_image_userId_fk` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_reporterId_fk` FOREIGN KEY (`reporterId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_targetId_fk` FOREIGN KEY (`targetId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_user_likes` ADD CONSTRAINT `_user_likes_A_fkey` FOREIGN KEY (`A`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_likes` ADD CONSTRAINT `_user_likes_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_stars` ADD CONSTRAINT `_user_stars_A_fkey` FOREIGN KEY (`A`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_stars` ADD CONSTRAINT `_user_stars_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
