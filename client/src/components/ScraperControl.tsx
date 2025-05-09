import React, { useState } from 'react'
import { scrapeAssets } from '../services/api/scraping.api'
//import "./ScraperControl.css";

interface ScraperProps {
  onScrapeComplete: (filePath: string) => void
}

export const ScraperControl: React.FC<ScraperProps> = ({ onScrapeComplete }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await scrapeAssets({ authorUrl: url })
      if (result.success) {
        onScrapeComplete(result.data.filePath)
      }
    } catch (err: any) {
      setError(err.message || 'Scraping failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="scraper-card">
      <h2>Freepik Scraper</h2>

      <form onSubmit={handleSubmit} className="scraper-form">
        <div className="form-group">
          <label htmlFor="author-url">Author URL:</label>
          <input
            id="author-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.freepik.com/author/..."
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Scraping...' : 'Start Scraping'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  )
}
