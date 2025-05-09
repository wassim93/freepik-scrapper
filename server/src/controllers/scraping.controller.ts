// src/controllers/scraping.controller.ts
import { Request, Response } from 'express'
import { ApiResponse, FreepikAsset } from '../types'
import { ScrapingService } from '../services/scraping.service'
import { CSVService } from '../services/scraping.csv'
import { GeminiService } from '../services/gemini.service'

export class ScrapingController {
  private service = new ScrapingService()
  private csvService = new CSVService()
  private aiService = new GeminiService()

  async scrape(req: Request, res: Response<ApiResponse<{ assets?: FreepikAsset[]; filePath?: string }>>) {
    try {
      // const assets = await this.service.scrapeData(req.body.authorUrl)
      // if (assets.length === 0) {
      //   return res.status(200).json({ success: true, data: { assets: [] } })
      // }

      // Process assets with Gemini AI
      const prompt = await this.aiService.generateEnhancedPrompt('Home indoor design concept')
      console.log('Generated prompt:', prompt)
      const filePath = await this.aiService.generateImage(prompt || '')
      console.log('Generated image file path:', filePath)
      //const filePath = await this.csvService.writeAssetsToCSV(assets)
      res.json({ success: true, data: { assets: [], filePath: '' } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
