// src/controllers/scraping.controller.ts
import { Request, Response } from 'express'
import { ScrapingService } from '../services/scraping.service'
import { ApiResponse } from '../types'

export class ScrapingController {
  private service = new ScrapingService()

  async scrape(req: Request, res: Response<ApiResponse<{ filePath: string }>>) {
    try {
      const filePath = await this.service.scrapeAndSave(req.body.authorUrl)
      res.json({ success: true, data: { filePath } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
