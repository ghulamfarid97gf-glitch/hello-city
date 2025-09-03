// API configuration and base setup
import axios from "axios";

// Base API configuration
const API_CONFIG = {
  WEBFLOW: {
    BASE_URL: "https://api.webflow.com/v2",
    // "/api/webflow",

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

// Request interceptor for authentication
webflowAPI.interceptors.request.use(
  (config) => {
    const token =
      "62ad3ed6e55b0370ab557d5b3d7b5c957afbeed6f158df3303e8fb0e516d0505";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error("❌ No API token found! Check your .env file");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
webflowAPI.interceptors.response.use(
  (response) => {
    // Log response in development
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });

    // Handle common error scenarios
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
