import React from 'react'
import { GeneratedImage } from '../types'
import '../styles/ImageDisplay.css'

interface ImageDisplayProps {
  images: GeneratedImage[]
  assetsPath?: string
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, assetsPath = '/assets/' }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL

  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-card">
          <img src={`${serverUrl}/output${assetsPath}${image?.metadata?.fileName}`} alt={image?.name} className="generated-image" />
          <p className="prompt-text">{image?.name}</p>
        </div>
      ))}
    </div>
  )
}
