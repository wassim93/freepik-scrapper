import React from 'react'
//import "./ImageDisplay.css";

interface ImageDisplayProps {
  images: any[]
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ images }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <div key={index} className="image-card">
          <img src={image.url} alt={image.prompt} className="generated-image" />
          <p className="prompt-text">{image.prompt}</p>
        </div>
      ))}
    </div>
  )
}
