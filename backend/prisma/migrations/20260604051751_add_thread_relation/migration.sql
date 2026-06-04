/*
  Warnings:

  - The `number_of_replies` column on the `threads` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Replies" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "like" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "threads" DROP COLUMN "number_of_replies",
ADD COLUMN     "number_of_replies" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "follow" (
    "id" SERIAL NOT NULL,
    "following_Id" INTEGER NOT NULL,
    "follower_id" INTEGER NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_following_Id_fkey" FOREIGN KEY ("following_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
