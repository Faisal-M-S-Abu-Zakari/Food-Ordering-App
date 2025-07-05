/*
  Warnings:

  - You are about to drop the column `streetAdress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `streetAdress` on the `User` table. All the data in the column will be lost.
  - Added the required column `streetAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "streetAdress",
ADD COLUMN     "streetAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "streetAdress",
ADD COLUMN     "streetAddress" TEXT;
