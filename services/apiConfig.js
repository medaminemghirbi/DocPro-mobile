import axios from "axios";

// Define the base URL based on your environment
const api = axios.create({
  baseURL: "http://192.168.1.18:3000", // Replace with your local IP and Rails port
  timeout: 10000, // Set a timeout (optional)
});

// Add request interceptors (optional)
api.interceptors.request.use(
  (config) => {
    // You can add headers or tokens here if needed
    // Example: config.headers.Authorization = `Bearer ${yourToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
