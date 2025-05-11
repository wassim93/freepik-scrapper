// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../types'
/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandler = (err: any, req: Request, res: Response<ApiResponse>, _next: NextFunction) => {
  console.error('Error:', err?.stack || err)
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err?.message || 'Unknown error',
  })
}
