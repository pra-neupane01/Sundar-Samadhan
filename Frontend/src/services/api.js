import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4849/api/v1",
});

// 🔹 Add an interceptor to include the Bearer token in every request automatically
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
