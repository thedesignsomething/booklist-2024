import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Test both tables
      const books = await prisma.book.findMany()
      const cms = await prisma.cMSData.findFirst()
      
      res.status(200).json({
        success: true,
        booksCount: books.length,
        books: books,
        cms: cms
      })
    } catch (error: any) {
      console.error('Database test error:', error)
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}