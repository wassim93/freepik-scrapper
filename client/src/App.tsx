import React, { useState } from 'react'
import { ScraperControl } from './components/ScraperControl'
import { ImageDisplay } from './components/ImageDisplay'
import './styles/App.css'
import { Layout } from './components/Layout'
import { GeneratedImage } from './types'

export const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const handleScrapeComplete = (assets: GeneratedImage[]) => {
    setGeneratedImages(assets)
  }

  return (
    <Layout>
      <div className="steps-container">
        <div className="step">
          <h2>1. Scrape Assets</h2>
          <ScraperControl onScrapeComplete={handleScrapeComplete} />
        </div>

        {generatedImages.length > 0 && (
          <div className="step">
            <h2>2. View Results</h2>
            <ImageDisplay images={generatedImages} />
          </div>
        )}
      </div>
    </Layout>
  )
}
