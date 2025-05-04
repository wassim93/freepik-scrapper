// src/network/axiosServer.ts
import axios from 'axios'

// Create an Axios instance for server-side requests
export const axiosServer = axios.create({
  headers: {},
})

// Request Interceptor
axiosServer.interceptors.request.use(
  (config) => {
    console.log(
      `[AXIOS_SERVER] 🚀 REQUEST → ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`
    )
    if (config.data) console.log(`[AXIOS_SERVER] 📦 Payload →`, config.data)
    return config
  },
  (error) => {
    console.error('[AXIOS_SERVER] ❌ REQUEST ERROR →', error.message)
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosServer.interceptors.response.use(
  (response) => {
    console.log(
      `[AXIOS_SERVER] ✅ RESPONSE ← ${response.status} ${response.config.url}`
    )
    return response
  },
  (error) => {
    if (error.response) {
      console.error(
        `[AXIOS_SERVER] ❌ RESPONSE ERROR ← ${error.response.status} ${error.config?.url}`
      )
      console.error(`[AXIOS_SERVER] 🧨 Error Data:`, error.response.data)
    } else if (error.request) {
      console.error('[AXIOS_SERVER] ❌ NO RESPONSE RECEIVED')
    } else {
      console.error('[AXIOS_SERVER] ❌ REQUEST SETUP ERROR:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosServer
