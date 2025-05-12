import React, { useEffect, useState } from 'react'
import { ScraperControl } from './components/ScraperControl'
import { ImageDisplay } from './components/ImageDisplay'
import './styles/App.css'
import { Layout } from './components/Layout'
import { GeneratedImage } from './types'
import { getAssets } from './services/api/scraping.api'

export const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [recentGeneratedImage, setRecentGeneratedImage] = useState<GeneratedImage[]>([])
  const handleScrapeComplete = (assets: GeneratedImage[]) => {
    setGeneratedImages(assets)
  }
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const result = await getAssets()
        if (result.success) {
          setRecentGeneratedImage(result.data.assets || [])
        }
      } catch (err: any) {
        setRecentGeneratedImage(err.message || 'Scraping failed')
      }
    }

    fetchAssets()
  }, [generatedImages.length])

  return (
    <Layout>
      <div className="steps-container">
        <div className="step">
          <h2>1. Scrape Assets</h2>
          <ScraperControl onScrapeComplete={handleScrapeComplete} />
        </div>

        {generatedImages.length > 0 && (
          <div className="step">
            <h2>Generated Results</h2>
            <ImageDisplay images={generatedImages} />
          </div>
        )}
        {recentGeneratedImage.length > 0 && (
          <div className="step">
            <h2>Recent Generated</h2>
            <ImageDisplay images={recentGeneratedImage} assetsPath="/" />
          </div>
        )}
      </div>
    </Layout>
  )
}
