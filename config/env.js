// env.js

// Determine the base URL based on environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'enter-api-here'
  : 'http://localhost:3001'; 

  const apiUsername = "lucas.hammarstrand@hotmail.com";
  const apiPassword = "Express4040";
  // const serverPassword = "1pJiZWW6GPo";
  
  export { baseURL, apiUsername, apiPassword };
