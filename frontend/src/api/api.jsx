import axios from "axios";

// রেন্ডারের ব্যাকএন্ড URL ব্যবহার করুন
const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://mcdpos.onrender.com/api" 
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // এখানে সরাসরি 'api' ব্যবহার করুন যেনbaseURL ঠিকঠাক পায়
        await api.get("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;