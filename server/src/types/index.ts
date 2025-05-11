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
  error?: string
}
