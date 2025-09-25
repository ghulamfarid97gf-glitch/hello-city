// API configuration and base setup
import axios from "axios";

const LOCAL_SERVER_PROXY_URL = "/api/webflow";
const WEB_FLOW_BASE_URL = "https://api.webflow.com/v2";

// Base API configuration
const API_CONFIG = {
  WEBFLOW: {
    BASE_URL: LOCAL_SERVER_PROXY_URL,
    TIMEOUT: 10000,
    HEADERS: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
};

// Create axios instances for different APIs
const webflowAPI = axios.create({
  baseURL: API_CONFIG.WEBFLOW.BASE_URL,
  timeout: API_CONFIG.WEBFLOW.TIMEOUT,
  headers: API_CONFIG.WEBFLOW.HEADERS,
});

// Request interceptor - REMOVE TOKEN FROM HERE since it's now handled by the proxy
webflowAPI.interceptors.request.use(
  (config) => {
    // Remove the token assignment since the proxy handles authentication
    // The proxy will add the Authorization header
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (keep as is)
webflowAPI.interceptors.response.use(
  (response) => {
    // ✅ Handle empty 204 responses (DELETE /live, etc.)
    if (response.status === 204) {
      return { ...response, data: null };
    }
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      console.error("Authentication failed. Please check your API token.");
    } else if (error.response?.status === 404) {
      console.error("Resource not found.");
    } else if (error.response?.status >= 500) {
      console.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export { webflowAPI, API_CONFIG };
