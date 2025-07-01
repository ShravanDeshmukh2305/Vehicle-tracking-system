import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method.toUpperCase()} request to ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}: ${response.status}`);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      console.error("🔍 API endpoint not found");
    } else if (error.response?.status === 500) {
      console.error("🔥 Server error occurred");
    } else if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timeout");
    }

    return Promise.reject(error);
  }
);

export const getCurrentLocation = () => axiosInstance.get("/vehicles/current");
export const getVehicleStats = () => axiosInstance.get("/vehicles/stats");
export const getRouteByDate = (date) => axiosInstance.get(`/vehicles/history/${date}`);
export const getLocationHistory = () => axiosInstance.get("/vehicles/history");
export const getVehicleRoute = () => axiosInstance.get("/vehicles/route");
export const updateVehicleLocation = (locationData) => axiosInstance.post("/vehicles/location", locationData);

export default axiosInstance;
