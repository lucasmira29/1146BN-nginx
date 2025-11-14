import axios from "axios";
import { getToken } from "@/utils/handleToken"; 

const url = import.meta.env.VITE_API_URL || "http://localhost:80";

const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {

    const publicPaths = [
      "/api/auth/login/password",
      "/api/auth/users/register", 
    ];

    if (config.url && !publicPaths.includes(config.url)) {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
