// src/services/scraping.service.ts
import { FreepikAsset } from '../types'
import { ScraperUtils } from '../utils/scraper.utils'
import { CSVService } from './scraping.csv'

export class ScrapingService {
  private csvService = new CSVService()

  scrapeData = async (authorUrl: string): Promise<FreepikAsset[]> => {
    try {
      return await ScraperUtils.scrapeAuthorAssets(authorUrl, 1, 2)
    } catch (error) {
      console.error('Scraping  failed:', error)
      throw new Error('Failed to scrape Freepik assets.')
    }
  }
}
