// src/utils/scraper.utils.ts
import path from 'path'
import fs from 'fs'
import { FreepikAsset } from '../types'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { fileURLToPath } from 'url'
import { ENV } from '../config/env.config'

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const OUTPUT_DIR = path.resolve(__dirname, `../output${ENV.ASSETS_PATH}`)
const IMAGE_EXTENSIONS = /\.(jpe?g|png)$/i

puppeteer.use(StealthPlugin())
export class ScraperUtils {
  static readdirAsync = (dir: string): Promise<fs.Dirent[]> =>
    new Promise((resolve, reject) => {
      fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) reject(err)
        else resolve(files)
      })
    })
  static async scrapeAuthorAssets(authorName: string, startIndex: number, endIndex: number): Promise<FreepikAsset[]> {
    try {
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const page = await browser.newPage()

      // Set realistic user agent & headers
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36')
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      })

      const assets: FreepikAsset[] = []

      for (let currentPage = startIndex; currentPage <= endIndex; currentPage++) {
        const searchUrl = `https://www.freepik.com/search?query=${encodeURIComponent(authorName)}&page=${currentPage}&last_filter=page&last_value=${currentPage}&sort=recent&type=illustration`

        await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 0 })
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

  static async getLocalAssets(): Promise<FreepikAsset[]> {
    // Ensure the folder exists and is a directory
    if (!fs.existsSync(OUTPUT_DIR) || !fs.statSync(OUTPUT_DIR).isDirectory()) {
      throw new Error(`Assets folder not found or not a directory: ${OUTPUT_DIR}`)
    }

    // Read directory entries
    const entries = await this.readdirAsync(OUTPUT_DIR)

    // Filter image files and map to FreepikAsset
    const assets: FreepikAsset[] = entries
      .filter((entry) => IMAGE_EXTENSIONS.test(entry.name))
      .map((entry) => {
        const fileName = entry.name
        const assetPath = path.join(OUTPUT_DIR, fileName)
        const name = path.parse(fileName).name

        return {
          name,
          path: assetPath,
          metadata: {
            title: name,
            description: '',
            keywords: [],
            fileName,
          },
        }
      })

    return assets
  }
}
