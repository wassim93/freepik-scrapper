// src/controllers/scraping.controller.ts
import { Request, Response } from 'express'
import { ApiResponse, FreepikAsset } from '../types'
import { ScrapingService } from '../services/scraping.service'
import { CSVService } from '../services/scraping.csv'
import { GeminiService } from '../services/gemini.service'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path'
import { QuotaService } from '../services/quota.service'
import { ENV } from '../config/env.config'

export class ScrapingController {
  private service = new ScrapingService()
  private csvService = new CSVService()
  private aiService = new GeminiService()
  private quotaService = new QuotaService()

  renameAsync = promisify(fs.rename)

  async scrape(req: Request, res: Response<ApiResponse<{ assets?: FreepikAsset[]; csvFilePath?: string }>>) {
    try {
      const usedToday = await this.quotaService.getTodayCount()
      const dailyQuota = ENV.AI_DAILY_QUOTA
      if (usedToday >= dailyQuota) {
        return res.status(429).json({ success: false, error: 'Daily AI image generation quota exceeded. Please try again tomorrow.' })
      }
      const assets: FreepikAsset[] = [
        {
          name: '3d rendering of hexagonal texture background',
          sourceUrlScrappedFrom: 'https://img.freepik.com/free-photo/3d-rendering-hexagonal-texture-background_23-2150796421.jpg?w=740,1,',
          pageIndexScrappedFrom: 1,
          metadata: null,
          path: null,
        },
        {
          name: 'Hand drawn mushroom   illustration',
          sourceUrlScrappedFrom: 'https://img.freepik.com/free-vector/hand-drawn-mushroom-illustration_23-2151223366.jpg?w=740,1,',
          pageIndexScrappedFrom: 1,
          metadata: null,
          path: null,
        },
      ]
      //await this.service.scrapeData(req.body.authorUrl)
      if (assets.length === 0) {
        return res.status(200).json({ success: true, data: { assets: [] } })
      }

      let imageCount = 0

      // Process assets with Gemini AI
      for (const asset of assets) {
        if (imageCount + usedToday >= dailyQuota) {
          console.warn('Quota limit reached during processing; stopping early.')
          break
        }
        const prompt = await this.aiService.generateEnhancedPrompt(asset.name)
        if (!prompt) continue // Skip if no prompt is generated

        const filePath = await this.aiService.generateImage(prompt || '')
        const metadata = await this.aiService.generateStockMetadata(prompt || '')
        if (metadata) {
          asset.metadata = metadata
          if (filePath && metadata?.title) {
            const safeTitle = metadata.title.replace(/[^\w-]/g, '_') // clean up title to be safe for filenames
            const newFileName = `${safeTitle}${path.extname(filePath)}`
            const newFilePath = path.join(path.dirname(filePath), newFileName)
            await this.renameAsync(filePath, newFilePath)
            asset.path = newFilePath
            asset.name = metadata.title
          }
        }
        imageCount++
        await this.quotaService.incrementTodayCount()
        // Add delay between each iteration to respect RPM
        await new Promise((resolve) => setTimeout(resolve, 6000)) // wait 6 seconds
      }

      const csvFilePath = await this.csvService.writeAssetsToCSV(assets)
      res.json({ success: true, data: { assets, csvFilePath } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
