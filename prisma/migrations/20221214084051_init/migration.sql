-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "familyNameKana" TEXT NOT NULL,
    "firstNameKana" TEXT NOT NULL,
    "mailAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "favoriteId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Item" (
    "itemId" SERIAL NOT NULL,
    "fesName" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "itemDetail" TEXT NOT NULL,
    "itemImage" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "playTime" INTEGER NOT NULL,
    "twoDaysPrice" INTEGER NOT NULL,
    "sevenDaysPrice" INTEGER NOT NULL,
    "categories" INTEGER[],
    "keywords" TEXT[],

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "review" (
    "reviewId" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "postTime" TEXT NOT NULL,
    "reviewTitle" TEXT NOT NULL,
    "reviewText" TEXT NOT NULL,
    "evaluation" INTEGER NOT NULL,
    "spoiler" BOOLEAN NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("reviewId")
);

-- CreateTable
CREATE TABLE "RentalHistory" (
    "rentalHistoryId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "itemImage" TEXT NOT NULL,
    "rentalPeriod" INTEGER NOT NULL,
    "payDate" TIMESTAMP(3) NOT NULL,
    "rentalStart" TIMESTAMP(3),
    "rentalEnd" TIMESTAMP(3),

    CONSTRAINT "RentalHistory_pkey" PRIMARY KEY ("rentalHistoryId")
);

-- CreateTable
CREATE TABLE "Cart" (
    "cartId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rentalPeriod" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartId")
);

-- CreateTable
CREATE TABLE "Chatbot" (
    "chatobotId" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "continue" BOOLEAN NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("chatobotId")
);

-- CreateTable
CREATE TABLE "ChatbotChoise" (
    "chatbotChoiseId" INTEGER NOT NULL,
    "chatobotId" INTEGER NOT NULL,
    "text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ChatbotAnswer" (
    "question1" INTEGER NOT NULL,
    "question2" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatbotChoise_chatbotChoiseId_key" ON "ChatbotChoise"("chatbotChoiseId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatbotChoise_chatobotId_key" ON "ChatbotChoise"("chatobotId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatbotAnswer_question1_key" ON "ChatbotAnswer"("question1");

-- CreateIndex
CREATE UNIQUE INDEX "ChatbotAnswer_question2_key" ON "ChatbotAnswer"("question2");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalHistory" ADD CONSTRAINT "RentalHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatbotChoise" ADD CONSTRAINT "ChatbotChoise_chatobotId_fkey" FOREIGN KEY ("chatobotId") REFERENCES "Chatbot"("chatobotId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatbotAnswer" ADD CONSTRAINT "ChatbotAnswer_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;
