import dotenv from 'dotenv'

// Load .env file
dotenv.config()

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  AI_API_KEY: process.env.GEMINI_API_KEY || '',
  AI_MODEL: process.env.GEMINI_MODEL || '',
  AI_IMAGE_MODEL: process.env.GEMINI_IMAGE_MODEL || '',
  AI_DAILY_QUOTA: parseInt(process.env.GEMINI_DAILY_QUOTA || '10'),
  SCRAPPING_START_PAGE: parseInt(process.env.SCRAPING_START_PAGE || '1'),
  SCRAPPING_END_PAGE: parseInt(process.env.SCRAPING_END_PAGE || '1'),
  ASSETS_PATH: process.env.ASSETS_PATH || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CSV_FILENAME_TO_CLEANUP: process.env.CSV_FILENAME_TO_CLEANUP || '',
}
