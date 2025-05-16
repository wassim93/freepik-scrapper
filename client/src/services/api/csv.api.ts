import axiosClient from './axiosClient'

export const cleanupCSV = async () => {
  const response = await axiosClient.get('/api/csv/cleanup')
  return response.data
}
