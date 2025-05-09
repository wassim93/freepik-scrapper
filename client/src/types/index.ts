// Shared types
export interface ScrapingRequest {
  authorUrl: string
}

export interface GeneratedImage {
  name?: string
  metadata?: ImageMetadata
  path?: string
}

export interface ImageMetadata {
  title?: string
  description?: string
  keywords?: string[]
  fileName?: string
}

export interface GenerationRequest {
  filePath: string
  promptTemplate: string
}

export interface AppError {
  message: string
  details?: string
}
