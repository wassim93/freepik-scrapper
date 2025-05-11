// src/routes/scraping.routes.ts
import express from 'express'
import { ScrapingController } from '../controllers/scraping.controller'

export const scrapingRoutes = (): express.Router => {
  const router = express.Router()
  const controller = new ScrapingController()

  router.post('/scrape', controller.scrape.bind(controller))
  router.get('/getAssets', controller.getAssets.bind(controller))
  router.get('/read-csv', controller.cleanupCSV.bind(controller))

  return router
}
