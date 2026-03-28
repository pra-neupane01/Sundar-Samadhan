import axios from "axios";

/**
 * Global axios instance for API communication
 */
const api = axios.create({
  baseURL: "http://localhost:4849/api/v1",
});

/**
 * Interceptor to automatically attach JWT token from localStorage to every outbound request
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
