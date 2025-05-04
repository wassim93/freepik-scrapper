import axios from 'axios'

// API client for backend communication
export const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Matches backend port
  timeout: 30000,
})

// Scraping endpoint
export const scrapeAssets = async (data: { authorUrl: string }) => {
  const response = await apiClient.post('/api/scraping/scrape', data)
  return response.data
}

// Image generation endpoint
export const generateImages = async (data: {
  filePath: string
  promptTemplate: string
}) => {
  const response = await apiClient.post('/api/ai/generate', data)
  return response.data
}
