import dotenv from 'dotenv'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  AI_API_KEY: process.env.AI_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
}
