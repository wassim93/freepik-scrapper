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
  NODE_ENV: process.env.NODE_ENV || 'development',
}
