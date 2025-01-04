import { prisma } from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bookId = parseInt(req.query.id as string)

  if (req.method === 'PUT') {
    try {
      const book = await prisma.book.update({
        where: { id: bookId },
        data: {
          title: req.body.title,
          author: req.body.author,
          coverUrl: req.body.coverUrl,
          genre: req.body.genre,
          vibe: req.body.vibe,
          readingFormat: req.body.readingFormat
        }
      })
      res.status(200).json(book)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update book' })
    }
  } 
  
  else if (req.method === 'DELETE') {
    try {
      await prisma.book.delete({
        where: { id: bookId }
      })
      res.status(200).json({ message: 'Book deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete book' })
    }
  }
}