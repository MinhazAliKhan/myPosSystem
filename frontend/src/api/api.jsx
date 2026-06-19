import axios from "axios";

const BASE_URL = "https://mcdpos.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // কুকি পাঠানোর জন্য এটি ম্যান্ডেটরি
  headers: {
    "Content-Type": "application/json",
  },
});

// ইন্টারসেপ্টর লজিক
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ৪০১ এরর হলে রিফ্রেশ টোকেন কল করবে
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // নতুন এক্সেস টোকেন পাওয়ার চেষ্টা করবে
        await api.get("/auth/refresh");
        // সফল হলে আগের রিকোয়েস্টটি আবার পাঠাবে
        return api(originalRequest);
      } catch (refreshError) {
        // রিফ্রেশও ফেইল করলে ইউজারকে আউট করে দেবে
        window.location.href = "/login"; // সরাসরি রিডাইরেক্ট করা সেফ
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;