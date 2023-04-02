-- DropForeignKey
ALTER TABLE `coupon` DROP FOREIGN KEY `coupon_userId_fk`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_userId_fk`;

-- DropForeignKey
ALTER TABLE `user_image` DROP FOREIGN KEY `user_image_userId_fk`;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon` ADD CONSTRAINT `coupon_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_image` ADD CONSTRAINT `user_image_userId_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
