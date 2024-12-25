import { prisma } from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const books = await prisma.book.findMany()
      res.status(200).json(books)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' })
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const book = await prisma.book.create({
        data: {
          title: req.body.title,
          author: req.body.author,
          coverUrl: req.body.coverUrl,
          genre: req.body.genre,
          vibe: req.body.vibe,
          publishDate: req.body.publishDate,
          readingFormat: req.body.readingFormat
        }
      })
      res.status(200).json(book)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create book' })
    }
  }
}