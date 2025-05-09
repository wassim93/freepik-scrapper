// src/services/quota.service.ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const QUOTA_FILE = path.resolve(__dirname, '../output/daily_quota.json')

export class QuotaService {
  private quota = { date: '', imageGenerationCount: 0 }

  constructor() {
    this.loadQuota()
  }

  private loadQuota() {
    if (fs.existsSync(QUOTA_FILE)) {
      const data = fs.readFileSync(QUOTA_FILE, 'utf-8')
      this.quota = JSON.parse(data)
    } else {
      this.resetQuota()
    }
  }

  private saveQuota() {
    fs.writeFileSync(QUOTA_FILE, JSON.stringify(this.quota, null, 2), 'utf-8')
  }

  private resetQuota() {
    this.quota = {
      date: new Date().toISOString().split('T')[0],
      imageGenerationCount: 0,
    }
    this.saveQuota()
  }

  private checkAndResetIfNeeded() {
    const today = new Date().toISOString().split('T')[0]
    if (this.quota.date !== today) {
      this.resetQuota()
    }
  }

  async getTodayCount(): Promise<number> {
    this.checkAndResetIfNeeded()
    return this.quota.imageGenerationCount
  }

  async incrementTodayCount(): Promise<void> {
    this.checkAndResetIfNeeded()
    this.quota.imageGenerationCount++
    this.saveQuota()
  }

  async hasQuota(maxPerDay: number): Promise<boolean> {
    this.checkAndResetIfNeeded()
    return this.quota.imageGenerationCount < maxPerDay
  }
}
