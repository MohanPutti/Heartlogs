-- AlterTable
ALTER TABLE `User` ADD COLUMN `passcodeFailedAttempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `passcodeHash` VARCHAR(191) NULL,
    ADD COLUMN `passcodeLockedUntil` DATETIME(3) NULL;
