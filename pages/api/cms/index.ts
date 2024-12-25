import { prisma } from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cmsData = await prisma.cMSData.findFirst()
      res.status(200).json(cmsData)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch CMS data' })
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const cmsData = await prisma.cMSData.upsert({
        where: { id: 1 }, // Assuming first record
        update: {
          pageTitle: req.body.pageTitle,
          pageDescription: req.body.pageDescription,
          primaryColor: req.body.appearance.primaryColor,
          secondaryColor: req.body.appearance.secondaryColor,
          fontFamily: req.body.appearance.fontFamily,
          filterCategories: JSON.stringify(req.body.filterCategories)
        },
        create: {
          pageTitle: req.body.pageTitle,
          pageDescription: req.body.pageDescription,
          primaryColor: req.body.appearance.primaryColor,
          secondaryColor: req.body.appearance.secondaryColor,
          fontFamily: req.body.appearance.fontFamily,
          filterCategories: JSON.stringify(req.body.filterCategories)
        }
      })
      res.status(200).json(cmsData)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update CMS data' })
    }
  }
}