import axios from "axios";

/*SERVER URL*/

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const API_URL = `${SERVER_URL}/api`;

/*AXIOS INSTANCE*/

const api = axios.create({
  baseURL: API_URL,
});

/*AUTO TOKEN*/

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;