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
        return res.status(429).json({ success: false, message: 'Daily AI image generation quota exceeded. Please try again tomorrow.' })
      }
      const assets = await this.service.scrapeData(req.body.authorName)
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
        if (!filePath) continue // Skip if no image was generated (no filePath)

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
            asset.metadata.fileName = newFileName
          }
        }
        imageCount++
        await this.quotaService.incrementTodayCount()
        // Add delay between each iteration to respect RPM
        await new Promise((resolve) => setTimeout(resolve, 6000)) // wait 6 seconds
      }

      const validAssets = assets.filter((asset) => asset.path && asset.metadata && asset.metadata.fileName)
      const csvFilePath = await this.csvService.writeAssetsToCSV(validAssets)
      res.json({ success: true, data: { assets: validAssets, csvFilePath } })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async cleanupCSV(req: Request, res: Response<ApiResponse<{ assets?: FreepikAsset[] }>>) {
    try {
      const csvFileName = 'freepik_assets_2025-05-09T20-53-14 - Copy.csv'
      const assets = await this.csvService.cleanupAssetsFromCSV(csvFileName)
      res.json({ success: true, data: { assets } })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }

  async getAssets(req: Request, res: Response<ApiResponse<{ assets?: FreepikAsset[] }>>) {
    try {
      const assets = await this.service.getLocalAssets()
      res.json({ success: true, data: { assets } })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
