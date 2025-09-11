// Application constants

// API Configuration
export const API_ENDPOINTS = {
  WEBFLOW: {
    BASE_URL: "https://api.webflow.com/v2",
    SITES: "/sites",
    COLLECTIONS: "/collections",
    ITEMS: "/items",
    PUBLISH: "/publish",
    DOMAINS: "/domains",
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  UNAUTHORIZED: "Authentication failed. Please check your API credentials.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  RATE_LIMIT: "Too many requests. Please wait before trying again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ITEM_CREATED: "Item created successfully",
  ITEM_UPDATED: "Item updated successfully",
  ITEM_DELETED: "Item deleted successfully",
  SITE_PUBLISHED: "Site published successfully",
  DATA_REFRESHED: "Data refreshed successfully",
};

// Loading States
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "userPreferences",
  THEME: "theme",
  API_CACHE: "apiCache",
  LAST_VISITED: "lastVisited",
};

// Theme Constants
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// Webflow Collection Field Types
export const WEBFLOW_FIELD_TYPES = {
  PLAIN_TEXT: "PlainText",
  RICH_TEXT: "RichText",
  IMAGE: "ImageRef",
  VIDEO: "VideoRef",
  LINK: "Link",
  EMAIL: "Email",
  PHONE: "Phone",
  NUMBER: "Number",
  DATE_TIME: "DateTime",
  SWITCH: "Switch",
  COLOR: "Color",
  OPTION: "Option",
  MULTI_REFERENCE: "MultiReference",
  REFERENCE: "Reference",
  USER: "User",
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "text/plain",
  ],
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  WITH_TIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  TIME_ONLY: "HH:mm",
};

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
};

// Environment Variables
export const ENV = {
  API_TOKEN: import.meta.env.VITE_WEBFLOW_API_TOKEN,
  SITE_ID: import.meta.env.VITE_WEBFLOW_SITE_ID,
  APP_NAME: import.meta.env.VITE_APP_NAME || "Webflow Dashboard",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

// constants/index.js
export const COLLECTIONS = {
  PERKS: "689046505062d22cb6485ac6", // Update this to your actual collection ID
};

export const PERK_TYPES = [
  { value: "claim", label: "1. Claim" },
  { value: "become-paid", label: "2. Become Paid" },
  { value: "purchase", label: "3. Purchase" },
  { value: "become-free", label: "4. Become Free" },
  { value: "raffle", label: "5. Raffle" },
];

export const MEMBER_ROLES = [
  { value: "Free Member", label: "Free Member" },
  { value: "Elite Member", label: "Elite Member" },
  { value: "Non Member", label: "Non Member" },
];

export const PLAN_WISE_COUPONS = [
  { value: "free-plans", label: "Free Plans" },
  { value: "paid-plans", label: "Paid Plans" },
];

export const displayArray = [
  // 👉 Perk-related fields moved to the start
  { name: "Perk Name" },
  { "location-address": "Perk Location" },
  { "video-link-text": "video Link" },
  { "start-date": "Start Date" },
  { "end-date": "End Date" },
  { offers: "offers" },
  { places: "Places" },
  { location: "Location / Venue / Place name" },

  // 👉 Remaining fields
  { "plan-wise-coupen": "Plan Wise Coupen" },
  { "video-thumbnail-link": "video-thumbnail-link" },
  { "thumbnail-image": "Thumbnail Image (Open Graph Search)" },
  { "offer-on-tickets-for-elite-members": "Offer (for Elite Members)" },
  { "how-much-save-for-elite-member": "Save (For Elite Member)" },
  { "offer-description-elite-member": "Perk destinations (For Elite Member)" },
  { "new-price-for-elite-member": "New Price (For Elite Member)" },
  { "cutoff-value-for-elite-member": "Value of perks (for Elite Member)" },
  { "offer-on-tickets-for-free-members": "Offer (for Free Members)" },
  { "how-much-save-for-free-member": "Save (For Free Member)" },
  { "cutoff-value-for-free-member": "Value of perks (for Free Member)" },
  { "new-price-for-free-member": "New Price (for Free Member)" },
  { "offer-description-free-member": "Perk destinations (Free Member)" },
  { slug: "Slug" },

  // 👉 Event-related fields grouped at the end
  { "event-name": "Event Name" },
  { description: "Event Description" },
  { "booking-link": "Booking Link" },
  { "event-link": "Event Link" },
  { when: "When?" },
  { "event-time": "Event Time" },
];
