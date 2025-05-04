import React, { useState } from 'react'
import { generateImages } from '../services/api/imageGeneration.api'
//import "./PromptProcessor.css";

interface GeneratorProps {
  filePath: string
  onGenerationComplete: (images: any[]) => void
}

export const PromptProcessor: React.FC<GeneratorProps> = ({
  filePath,
  onGenerationComplete,
}) => {
  const [promptTemplate, setPromptTemplate] = useState(
    'Create a modern design based on {assetName}'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await generateImages({ filePath, promptTemplate })
      if (result.success) {
        onGenerationComplete(result.data.generatedImages)
      }
    } catch (err: any) {
      setError(err.message || 'Image generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="generator-card">
      <h2>Prompt Processor</h2>

      <form onSubmit={handleSubmit} className="generator-form">
        <div className="form-group">
          <label htmlFor="prompt">Prompt Template:</label>
          <textarea
            id="prompt"
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            rows={4}
          />
          <small className="hint">
            Use assetName as placeholder for asset name
          </small>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Generating...' : 'Generate Images'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  )
}
