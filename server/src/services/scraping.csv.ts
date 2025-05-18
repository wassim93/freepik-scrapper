import { format, parseFile, writeToPath } from 'fast-csv'
import { AdobeStockType, CsvFilesPath, AssetCsvRow, FreepikAsset } from '../types'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ENV } from '../config/env.config'

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const OUTPUT_DIR = path.resolve(__dirname, '../output')

export class CSVService {
  /** Internal helper to write any array of objects to CSV */
  writeDataToCsv = (filePath: string, headers: string[], rows: Record<string, any>[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(filePath)
      const csvStream = format({ headers, writeHeaders: true })
      csvStream
        .pipe(ws)
        .on('error', reject)
        .on('finish', () => {
          console.log(`CSV successfully written to ${filePath}`)
          resolve()
        })

      for (const row of rows) {
        csvStream.write(row)
      }
      csvStream.end()
    })
  }

  /** Read existing CSV into array of objects using parseFile */
  readCsv = <T = Record<string, any>>(filePath: string, csvFileName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      const rows: T[] = []
      parseFile(filePath, { headers: true })
        .on('error', (err) => {
          console.error(`❌ Fast CSV parsing error in file: ${csvFileName}`, err)
          reject(err)
        })
        .on('data', (row) => rows.push(row))
        .on('end', () => {
          console.log(`Parsed and filtered CSV: ${csvFileName}, valid rows: ${rows.length}`)
          resolve(rows)
        })
    })
  }

  writeAssetsToCSV = async (assets: FreepikAsset[]): Promise<CsvFilesPath> => {
    try {
      if (assets.length === 0) {
        throw new Error('No assets to write to CSV.')
      }

      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true })
      }

      const timestamp = new Date().toISOString().split('T')[0]
      const assetsFilename = `keyword_assets_${timestamp}.csv`
      const adobeStockFilename = `adobe_stock_assets_${timestamp}.csv`
      const assetsFilePath = path.join(OUTPUT_DIR, assetsFilename)
      const adobeStockFilePath = path.join(OUTPUT_DIR, adobeStockFilename)

      let assetsResult: AssetCsvRow[] = assets.map((asset) => ({
        title: asset.metadata?.title || '',
        description: asset.metadata?.description || '',
        keywords: asset.metadata?.keywords?.join(', ') || '',
        filename: asset.metadata?.fileName || '',
        pageIndexScrappedFrom: asset.pageIndexScrappedFrom,
        sourceUrlScrappedFrom: asset.sourceUrlScrappedFrom,
        path: asset.path || '',
      }))

      if (fs.existsSync(assetsFilePath)) {
        const rows = await this.readCsv<AssetCsvRow>(assetsFilePath, assetsFilename)
        assetsResult = [...rows, ...assetsResult]
      }

      await this.writeDataToCsv(
        assetsFilePath,
        ['title', 'description', 'keywords', 'filename', 'pageIndexScrappedFrom', 'sourceUrlScrappedFrom', 'path'],
        assetsResult
      )

      let adobeStockResult: AdobeStockType[] = assets.map((asset) => {
        const originalFileName = asset.metadata?.fileName || ''
        // Only replace the .png extension (case-insensitive) with .jpg
        const newFileName = originalFileName.replace(/\.png$/i, '.jpg')
        return {
          Filename: newFileName,
          Title: asset.metadata?.description || '',
          Keywords: asset.metadata?.keywords?.join(', ') || '',
          Category: '',
          Releases: '',
        }
      })

      if (fs.existsSync(adobeStockFilePath)) {
        const rows = await this.readCsv<AdobeStockType>(adobeStockFilePath, adobeStockFilename)
        adobeStockResult = [...rows, ...adobeStockResult]
      }
      await this.writeDataToCsv(adobeStockFilePath, ['Filename', 'Title', 'Keywords', 'Category', 'Releases'], adobeStockResult)

      return { assetsFilePath, adobeStockFilePath }
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
          //console.log('******', row)
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
