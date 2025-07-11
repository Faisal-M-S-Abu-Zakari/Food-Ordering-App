/*
  Warnings:

  - You are about to drop the column `basePrise` on the `Product` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE product_order_seq;
ALTER TABLE "Product" DROP COLUMN "basePrise",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "order" SET DEFAULT nextval('product_order_seq');
ALTER SEQUENCE product_order_seq OWNED BY "Product"."order";
