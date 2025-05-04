// src/utils/scraper.utils.ts
import { JSDOM } from 'jsdom'
import { FreepikAsset } from '../types'
import { axiosServer } from '../network/axiosServer'

export class ScraperUtils {
  static async scrapeAuthorAssets(authorUrl: string): Promise<FreepikAsset[]> {
    try {
      const response = await axiosServer.get(authorUrl)
      const dom = new JSDOM(response.data)
      const document = dom.window.document

      const assets: FreepikAsset[] = []
      const itemElements = document.querySelectorAll(
        '.search-result__items .item'
      )

      itemElements.forEach((item) => {
        const nameElement = item.querySelector('.item__name')
        const linkElement = item.querySelector('a')

        if (nameElement && linkElement) {
          assets.push({
            name: nameElement.textContent?.trim() || '',
            url: `https://www.freepik.com${linkElement.getAttribute('href')}`,
            author: authorUrl.split('/').pop() || '',
            category:
              item.querySelector('.item__category')?.textContent?.trim() || '',
          })
        }
      })

      return assets
    } catch (error) {
      throw new Error(`Scraping failed: ${error.message}`)
    }
  }
}
