/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
//import { scrapingRoutes } from "./routes/scraping.routes";
import { ENV } from './config/env.config'
import { errorHandler } from './middelware/error.middleware'
import { scrapingRoutes } from './routes/scraping.routes'
import path from 'path'
import { fileURLToPath } from 'url'
import { csvRoutes } from './routes/csv.routes'

console.log('Starting server...')
//console.log('Environment:', ENV)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const outputPath = path.join(__dirname, 'output')

app.use('/output', express.static(outputPath))
// Routes
app.use('/api/scraping', scrapingRoutes())
app.use('/api/csv', csvRoutes())

// Error handler
app.use(errorHandler)

// Start server
app.listen(ENV.PORT, () => {
  console.log(`✅ Server running on http://localhost:${ENV.PORT}`)
  console.log(`✅ Serving images from /output at http://localhost:${ENV.PORT}/output/assets`)
})
