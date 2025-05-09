// src/utils/scraper.utils.ts
import { FreepikAsset } from '../types'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())
export class ScraperUtils {
  static async scrapeAuthorAssets(authorName: string, startIndex: number, endIndex: number): Promise<FreepikAsset[]> {
    try {
      const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()

      // Set realistic user agent & headers
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36')
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      })

      // 🛑 Log all network requests
      page.on('request', (request) => {
        console.log(`➡️ [Request] ${request.method()} ${request.url()}`)
      })

      // ✅ Log all responses
      page.on('response', async (response) => {
        console.log(`⬅️ [Response] ${response.status()} ${response.url()}`)
      })

      // ❌ Log failed requests
      page.on('requestfailed', (request) => {
        console.log(`❌ [Request Failed] ${request.url()} - ${request.failure()?.errorText}`)
      })

      // 🟡 Log console messages from the page
      page.on('console', (msg) => {
        console.log(`🟡 [Console] ${msg.type()} - ${msg.text()}`)
      })

      const assets: FreepikAsset[] = []

      for (let currentPage = startIndex; currentPage <= endIndex; currentPage++) {
        const searchUrl = `https://www.freepik.com/search?query=${encodeURIComponent(authorName)}&type=photo&page=${currentPage}&last_filter=page&last_value=${currentPage}`

        await page.goto(searchUrl, { waitUntil: 'networkidle0' })
        const figures = await page.$$eval('figure[data-cy="resource-thumbnail"]', (elements) => {
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

      //console.log('Assets scraped:', assets)

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
