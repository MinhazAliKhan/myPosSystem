import axios from "axios";

// এখানে ভেরিয়েবলটি সঠিকভাবে সেট করা হয়েছে
const BASE_URL = "https://mcdpos.onrender.com/api";

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
        // এখানে BASE_URL ব্যবহার করা হয়েছে
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