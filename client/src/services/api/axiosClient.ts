import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:3001', // Matches backend port
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  // Add auth header if needed
  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err.response || err)
    return Promise.reject(err)
  }
)

export default axiosClient
