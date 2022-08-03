/*
  Warnings:

  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('brand', 'set', 'category', 'class');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('completed', 'failed', 'in_progress', 'received');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'category';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category_id",
ADD COLUMN     "SKU" TEXT,
ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "ProductCategory" (
    "category_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "OrderDetails" (
    "id" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT,
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "qty" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "PaymentDetails" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "PaymentDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "OrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
