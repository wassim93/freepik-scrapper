// src/utils/scraper.utils.ts
import { FreepikAsset } from '../types'
import puppeteer from 'puppeteer'

export class ScraperUtils {
  static async scrapeAuthorAssets(authorUrl: string, startIndex: number, endIndex: number): Promise<FreepikAsset[]> {
    try {
      const browser = await puppeteer.launch({
        headless: false,
      })
      const page = await browser.newPage()

      const assets: FreepikAsset[] = []

      for (let currentPage = startIndex; currentPage <= endIndex; currentPage++) {
        await page.goto(`${authorUrl}/${currentPage}`, { waitUntil: 'networkidle2' })
        const figures = await page.$$eval('figure[data-cy="resource-thumbnail"]', (elements) => {
          // Return the list of elements to process outside of the $$eval call
          return elements.map((figure) => {
            const img = figure.querySelector('img')
            const alt = img?.getAttribute('alt') || ''
            const src = img?.getAttribute('src') || ''
            return { alt, src }
          })
        })

        figures.forEach((figure) => {
          assets.push({
            name: figure.alt,
            sourceUrlScrappedFrom: figure.src,
            pageIndexScrappedFrom: currentPage,
            metadata: null,
            path: null,
          })
        })
      }

      console.log('Assets scraped:', assets)

      await browser.close()

      return assets
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Scraping failed: ${error.message}`)
      } else {
        throw new Error('Scraping failed: An unknown error occurred')
      }
    }
  }
}
