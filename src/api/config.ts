import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://tracker.cherrypump.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("❌ [API Config] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ [API Config] Response received:", {
      endpoint: response.config.url,
      status: response.status,
      success: response.data?.success,
    });
    return response;
  },
  async (error) => {
    if (error.response?.status === 404) {
      console.warn("⚠️ [API Config] Resource not found:", error.config?.url);
    } else if (error.response?.status >= 500) {
      console.error("❌ [API Config] Server error:", error.message);
    }

    console.error("❌ [API Config] Response error:", {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
