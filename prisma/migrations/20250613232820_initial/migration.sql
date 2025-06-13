-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_number_key" ON "members"("number");
