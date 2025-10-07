import axios from "axios";

const API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

console.log("API_KEY ", API_KEY);
// Backend server URLs
const LOCAL_SERVER_URL = "http://localhost:3000";
const PRODUCTION_SERVER_URL = ""; // Add your deployed backend URL later

// Use local for development, production for deployed
const API_BASE_URL = import.meta.env.PROD
  ? PRODUCTION_SERVER_URL
  : LOCAL_SERVER_URL;

const API_CONFIG = {
  WEBFLOW: {
    BASE_URL: `${API_BASE_URL}/api`,
    TIMEOUT: 10000,
    HEADERS: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": import.meta.env.VITE_CLIENT_API_KEY || "",
    },
  },
};

const webflowAPI = axios.create({
  baseURL: API_CONFIG.WEBFLOW.BASE_URL,
  timeout: API_CONFIG.WEBFLOW.TIMEOUT,
  headers: API_CONFIG.WEBFLOW.HEADERS,
});

webflowAPI.interceptors.request.use(
  (config) => {
    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

webflowAPI.interceptors.response.use(
  (response) => {
    // Your backend wraps data in { data: ... }
    if (response.data?.data) {
      return { ...response, data: response.data.data };
    }
    if (response.status === 204) {
      return { ...response, data: null };
    }
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message;
    console.error("API Error:", {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export { webflowAPI, API_CONFIG };
