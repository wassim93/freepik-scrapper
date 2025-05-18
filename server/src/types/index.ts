export interface FreepikAsset {
  name: string
  sourceUrlScrappedFrom?: string
  pageIndexScrappedFrom?: number
  path?: string | null
  metadata?: AssetMetaData | null
}

export interface AssetMetaData {
  title?: string | null
  description?: string | null
  keywords?: string[] | null
  fileName?: string | null
}

export interface AssetCsvRow {
  title?: string | null
  description?: string | null
  keywords?: string | null
  fileName?: string | null
  sourceUrlScrappedFrom?: string
  pageIndexScrappedFrom?: number
  path?: string | null
}

export interface AdobeStockType {
  Filename?: string | null
  Title?: string | null
  Keywords?: string | null
  Category?: string | null
  Releases?: string | null
}

export interface AIPrompt {
  basePrompt: string
  variations?: number
  resolution?: string
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  timestamp: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export interface CsvFilesPath {
  assetsFilePath?: string | null
  adobeStockFilePath?: string | null
}
