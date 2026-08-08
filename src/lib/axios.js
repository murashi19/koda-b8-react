import { store } from "@/app/store";
import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_URL,
  baseURL: `http://localhost:8081`,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
