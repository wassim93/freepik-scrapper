import { FreepikAsset } from '../types'
import { write } from 'fast-csv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const OUTPUT_DIR = path.resolve(__dirname, '../output')
export class CSVService {
  async writeAssetsToCSV(
    assets: FreepikAsset[],
    filename: string
  ): Promise<string> {
    try {
      // Ensure output directory exists
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true })
      }

      const filePath = path.join(OUTPUT_DIR, `${filename}.csv`)
      const ws = fs.createWriteStream(filePath)

      return new Promise((resolve, reject) => {
        write(assets, { headers: true })
          .on('error', (error) => {
            console.error('CSV write error:', error)
            reject(error)
          })
          .on('finish', () => {
            console.log(`CSV successfully written to ${filePath}`)
            resolve(filePath)
          })
          .pipe(ws)
      })
    } catch (error) {
      console.error('Failed to write assets to CSV:', error)
      throw new Error('Could not write CSV file.')
    }
  }
}
