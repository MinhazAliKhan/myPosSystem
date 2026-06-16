import axios from "axios";

// এখানে তোমার Render থেকে পাওয়া ব্যাকএন্ড লিঙ্কটি দাও (যেমন: https://your-backend.onrender.com)
const BASE_URL = "https://https://mcdpos.onrender.com/api"; 

const api = axios.create({
  baseURL: BASE_URL,
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
        // এখানেও baseURL ব্যবহার করো
        await axios.get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });

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