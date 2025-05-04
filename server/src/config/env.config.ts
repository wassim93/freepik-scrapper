import dotenv from 'dotenv'

// Load .env file
dotenv.config()

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  AI_API_KEY: process.env.AI_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
}
