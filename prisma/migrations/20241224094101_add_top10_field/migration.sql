-- CreateTable
CREATE TABLE "CMSData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageTitle" TEXT NOT NULL,
    "pageDescription" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "filterCategories" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "vibe" TEXT NOT NULL,
    "publishDate" TEXT NOT NULL,
    "readingFormat" TEXT NOT NULL,
    "isTop10" BOOLEAN NOT NULL DEFAULT false
);
