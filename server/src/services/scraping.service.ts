// src/services/scraping.service.ts
import { ScraperUtils } from '../utils/scraper.utils'
import { CSVService } from './scraping.csv'

export class ScrapingService {
  private csvService = new CSVService()

  async scrapeAndSave(authorUrl: string): Promise<string> {
    try {
      const assets = await ScraperUtils.scrapeAuthorAssets(authorUrl)
      const filename = `freepik_assets_${Date.now()}`
      return await this.csvService.writeAssetsToCSV(assets, filename)
    } catch (error) {
      console.error('Scraping and saving failed:', error)
      throw new Error('Failed to scrape and save Freepik assets.')
    }
  }
}
