import { GoogleGenAI, Modality } from '@google/genai'
import { ENV } from '../config/env.config'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const modulePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(modulePath)
const OUTPUT_DIR = path.resolve(__dirname, '../output')
export class GeminiService {
  geminiAi = new GoogleGenAI({ apiKey: ENV.AI_API_KEY })

  generateEnhancedPrompt = async (imageName: string): Promise<string | null> => {
    try {
      const response = await this.geminiAi.models.generateContent({
        model: ENV.AI_MODEL,
        contents: `Create a detailed and enhanced AI prompt that can be used to generate a high-quality image of "${imageName}" suitable for stock image platforms like Adobe Stock. The prompt should specify a high resolution, aiming for the equivalent of 300 DPI or at least 4000x3000 pixels, to ensure suitability for printing and commercial use. The prompt should also include specific details about the subject, potential style elements, keywords relevant for stock image searches, and considerations for good visual quality (like lighting and composition). Aim for a prompt that would instruct an AI image generator to produce a commercially viable and visually appealing result.`,
      })

      if (
        response &&
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts[0].text
      ) {
        const prompt = response.candidates[0].content.parts[0].text
        console.log('Generated Enhanced Prompt (for flash):', prompt)
        return prompt
      } else {
        console.log('No valid prompt received.')
        return null
      }
    } catch (error) {
      console.error('Error generating prompt:', error)
      return null
    }
  }

  generateImage = async (prompt: string): Promise<string | null> => {
    try {
      const response = await this.geminiAi.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      })

      const parts = response?.candidates?.[0]?.content?.parts
      if (!parts || parts.length === 0) {
        console.error('Error: No content parts received.')
        return null
      }

      for (const part of parts) {
        // Save image data if present
        if (part.inlineData?.data) {
          const imageData = part.inlineData.data
          // Ensure output directory exists
          if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true })
          }
          // Generate a unique filename
          const filename = `gemini-image-${Date.now()}.png`
          const filePath = path.join(OUTPUT_DIR, filename)
          // Write the image file
          const buffer = Buffer.from(imageData, 'base64')
          fs.writeFileSync(filePath, buffer)
          console.log(`Image saved to ${filePath}`)
          return filePath
        }
        // Log any text part
        if (part.text) {
          console.log('Generated text:', part.text)
        }
      }

      console.error('Error: No valid image data found in parts.')
      return null
    } catch (error: any) {
      console.error('Error generating image:', error)
      return null
    }
  }
}
