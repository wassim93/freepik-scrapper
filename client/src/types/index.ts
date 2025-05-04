// Shared types
export interface ScrapingRequest {
  authorUrl: string;
}

export interface GenerationRequest {
  filePath: string;
  promptTemplate: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface AppError {
  message: string;
  details?: string;
}
