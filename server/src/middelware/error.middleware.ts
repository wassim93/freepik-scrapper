/* eslint-disable no-console */
// src/middleware/error.middleware.ts
import { Request, Response } from 'express'
import { ApiResponse } from '../types'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiResponse>
) => {
  console.error('Error:', err.stack)
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  })
}
