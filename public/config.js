// API Configuration
// Update this with your backend URL when deployed
const API_CONFIG = {
  // For local development, use relative URL
  // For production, set this to your backend URL (e.g., 'https://your-backend.vercel.app' or 'https://api.aigirlfriend.com')
  baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '' // Use relative URL for local dev
    : 'https://your-backend-url.here' // ⚠️ UPDATE THIS with your actual backend URL
};
