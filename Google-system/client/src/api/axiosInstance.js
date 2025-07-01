import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})


axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error("❌ Request error:", error)
    return Promise.reject(error)
  },
)


axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error("❌ Response error:", error.response?.data || error.message)

    if (error.response?.status === 404) {
      console.error("🔍 API endpoint not found")
    } else if (error.response?.status === 500) {
      console.error("🔥 Server error occurred")
    } else if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timeout")
    }

    return Promise.reject(error)
  },
)

export const getCurrentLocation = () => {
  return axiosInstance.get("/vehicles/current")
}

export const getVehicleStats = () => {
  return axiosInstance.get("/vehicles/stats")
}

export const getRouteByDate = (date) => {
  return axiosInstance.get(`/vehicles/history/${date}`)
}

export const getLocationHistory = () => {
  return axiosInstance.get("/vehicles/history")
}

export const getVehicleRoute = () => {
  return axiosInstance.get("/vehicles/route")
}

export const updateVehicleLocation = (locationData) => {
  return axiosInstance.post("/vehicles/location", locationData)
}

export default axiosInstance

