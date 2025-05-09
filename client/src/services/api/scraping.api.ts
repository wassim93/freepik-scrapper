import axiosClient from './axiosClient'

// Scraping endpoint
export const scrapeAssets = async (data: { authorName: string }) => {
  const response = await axiosClient.post('/api/scraping/scrape', data)
  return response.data
}
