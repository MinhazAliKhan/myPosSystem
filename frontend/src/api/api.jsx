import axios from "axios";

const api = axios.create({
  baseURL: "https://mcdpos.onrender.com/api",
  withCredentials: true, // কুকির জন্য ম্যান্ডেটরি
});

// রিকোয়েস্ট ইন্টারসেপ্টর: এটি কুকি পাঠানোর নিশ্চয়তা দেয়
api.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

// রেসপন্স ইন্টারসেপ্টর: ৪০১ হলে অটো রিফ্রেশ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get("/auth/refresh"); // রিফ্রেশ কল
        return api(originalRequest); // আবার রিকোয়েস্ট করো
      } catch (err) {
        window.location.href = "/login"; // রিফ্রেশও ফেইল করলে লগইন
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
export default api;