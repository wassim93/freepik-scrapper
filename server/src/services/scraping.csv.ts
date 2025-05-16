import { format, parseFile, writeToPath } from 'fast-csv'
import { FreepikAsset } from '../types'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ENV } from '../config/env.config'

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const OUTPUT_DIR = path.resolve(__dirname, '../output')

export class CSVService {
  writeAssetsToCSV = async (assets: FreepikAsset[]): Promise<string> => {
    try {
      if (assets.length === 0) {
        throw new Error('No assets to write to CSV.')
      }

      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true })
      }

      const timestamp = new Date().toISOString().split('.')[0].replace(/[:]/g, '-')
      const filename = `freepik_assets_${timestamp}.csv`
      const filePath = path.join(OUTPUT_DIR, filename)

      const ws = fs.createWriteStream(filePath)
      const csvStream = format({ headers: true })

      csvStream.pipe(ws).on('finish', () => {
        console.log(`CSV successfully written to ${filePath}`)
      })

      for (const asset of assets) {
        csvStream.write({
          title: asset.metadata?.title || '',
          description: asset.metadata?.description || '',
          keywords: asset.metadata?.keywords?.join(', ') || '',
          filename: asset.metadata?.fileName || '',
          pageIndexScrappedFrom: asset.pageIndexScrappedFrom,
          sourceUrlScrappedFrom: asset.sourceUrlScrappedFrom,
          path: asset.path || '',
        })
      }

      csvStream.end()

      return filePath
    } catch (error) {
      console.error('Failed to write assets to CSV:', error)
      throw new Error('Could not write CSV file.')
    }
  }

  cleanupAssetsFromCSV = async (csvFileName: string): Promise<FreepikAsset[]> => {
    const csvFilePath = path.join(OUTPUT_DIR, csvFileName)

    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at path: ${csvFilePath}`)
    }

    const assets: FreepikAsset[] = []

    await new Promise<void>((resolve, reject) =>
      parseFile(csvFilePath, { headers: true })
        .on('error', (err) => {
          console.error(`❌ Fast CSV parsing error in file: ${csvFileName}`, err)
          reject
        })
        .on('data', (row) => {
          console.log('******', row)
          const assetPath = path.join(path.join(OUTPUT_DIR, ENV.ASSETS_PATH), row.filename)
          if (row.filename && fs.existsSync(assetPath)) {
            const asset: FreepikAsset = {
              name: row.title,
              sourceUrlScrappedFrom: row.sourceUrlScrappedFrom,
              pageIndexScrappedFrom: parseInt(row.pageIndexScrappedFrom, 10),
              metadata: {
                title: row.title,
                description: row.description,
                keywords: row.keywords.split(', ').map((keyword: string) => keyword.trim()),
                fileName: row.filename,
              },
              path: assetPath,
            }
            assets.push(asset)
          } else {
            console.log('file not found for row :', row)
          }
        })
        .on('end', () => {
          console.log(`Parsed and filtered CSV: ${csvFileName}, valid rows: ${assets.length}`)
          resolve()
        })
    )

    await new Promise<void>((resolve, reject) => {
      const ws = writeToPath(
        csvFilePath,
        assets.map((asset) => ({
          title: asset.metadata?.title || '',
          description: asset.metadata?.description || '',
          keywords: asset.metadata?.keywords?.join(', ') || '',
          filename: asset.metadata?.fileName || '',
          pageIndexScrappedFrom: asset.pageIndexScrappedFrom,
          sourceUrlScrappedFrom: asset.sourceUrlScrappedFrom,
          path: asset.path || '',
        })),
        { headers: true }
      )
      ws.on('error', reject)
      ws.on('finish', () => {
        console.log(`Filtered CSV successfully written to ${csvFilePath}`)
        resolve()
      })
    })

    return assets
  }
}
