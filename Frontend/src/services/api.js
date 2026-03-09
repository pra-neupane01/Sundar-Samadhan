import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4849/api/v1",
});

export default api;
