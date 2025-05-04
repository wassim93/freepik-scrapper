export interface FreepikAsset {
  name: string
  url: string
  author: string
  category: string
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
