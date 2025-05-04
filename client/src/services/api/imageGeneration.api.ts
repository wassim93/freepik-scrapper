import axiosClient from './axiosClient'

export const generateImages = async (data: {
  filePath: string
  promptTemplate: string
}) => {
  const response = await axiosClient.post('/api/ai/generate', data)
  return response.data
}
