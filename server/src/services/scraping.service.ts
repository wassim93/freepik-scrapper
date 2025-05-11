// src/services/scraping.service.ts
import { ENV } from '../config/env.config'
import { FreepikAsset } from '../types'
import { ScraperUtils } from '../utils/scraper.utils'

export class ScrapingService {
  scrapeData = async (authorName: string): Promise<FreepikAsset[]> => {
    try {
      return await ScraperUtils.scrapeAuthorAssets(authorName, ENV.SCRAPPING_START_PAGE, ENV.SCRAPPING_END_PAGE)
    } catch (error) {
      console.error('Scraping  failed:', error)
      throw new Error('Failed to scrape Freepik assets.')
    }
  }

  getLocalAssets = async (): Promise<FreepikAsset[]> => {
    try {
      return await ScraperUtils.getLocalAssets()
    } catch (error) {
      console.error('Getting local assets failed:', error)
      throw new Error('Failed to get local assets.')
    }
  }
}
