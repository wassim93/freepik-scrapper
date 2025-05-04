import React, { useState } from 'react'
import { ScraperControl } from './components/ScraperControl'
import { PromptProcessor } from './components/PromptProcessor'
import { ImageDisplay } from './components/ImageDisplay'
import './styles/App.css'
import { Layout } from './components/Layout'

export const App: React.FC = () => {
  const [csvPath, setCsvPath] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])

  const handleScrapeComplete = (filePath: string) => {
    setCsvPath(filePath)
  }

  const handleGenerationComplete = (images: any[]) => {
    setGeneratedImages(images)
  }

  return (
    <Layout>
      <div className="steps-container">
        <div className="step">
          <h2>1. Scrape Assets</h2>
          <ScraperControl onScrapeComplete={handleScrapeComplete} />
        </div>

        {csvPath && (
          <div className="step">
            <h2>2. Generate Images</h2>
            <PromptProcessor
              filePath={csvPath}
              onGenerationComplete={handleGenerationComplete}
            />
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="step">
            <h2>3. View Results</h2>
            <ImageDisplay images={generatedImages} />
          </div>
        )}
      </div>
    </Layout>
  )
}
