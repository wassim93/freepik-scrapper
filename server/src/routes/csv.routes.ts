// src/routes/scraping.routes.ts
import express from 'express'
import { ScrapingController } from '../controllers/scraping.controller'

export const csvRoutes = (): express.Router => {
  const router = express.Router()
  const controller = new ScrapingController()

  router.get('/cleanup', controller.cleanupCSV.bind(controller))

  return router
}
