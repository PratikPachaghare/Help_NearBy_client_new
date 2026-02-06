import axios from "axios";

// export const SERVER_URL = "http://10.0.2.2:5000";
export const SERVER_URL = "http://localhost:5000";
// export const SERVER_URL = "https://dicipline-mobail-app-server.onrender.com";

// 2. The API URL (Used for axios/fetch calls)
export const BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

// Always attach token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
