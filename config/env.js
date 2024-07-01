// env.js

// Determine the base URL based on environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'enter-api-here'
  : 'http://localhost:3001'; 

export default baseURL;
