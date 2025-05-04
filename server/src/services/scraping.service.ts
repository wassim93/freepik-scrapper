// src/services/scraping.service.ts
import { write } from 'fast-csv'
import fs from 'fs'
import path from 'path'
import { FreepikAsset } from '../types'
import { ScraperUtils } from '../utils/scraper.utils'

export class CSVService {
  async writeAssetsToCSV(
    assets: FreepikAsset[],
    filename: string
  ): Promise<string> {
    const outputDir = path.resolve(__dirname, '../../output')
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

    const filePath = path.join(outputDir, `${filename}.csv`)

    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(filePath)

      write(assets, { headers: true })
        .on('error', reject)
        .on('finish', () => resolve(filePath))
        .pipe(ws)
    })
  }
}

export class ScrapingService {
  private csvService = new CSVService()

  async scrapeAndSave(authorUrl: string): Promise<string> {
    const assets = await ScraperUtils.scrapeAuthorAssets(authorUrl)
    return this.csvService.writeAssetsToCSV(
      assets,
      `freepik_assets_${Date.now()}`
    )
  }
}
