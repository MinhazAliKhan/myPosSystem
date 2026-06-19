import axios from "axios";

// ১. বেস ইউআরএল সেটআপ
const api = axios.create({
  baseURL: "https://mcdpos.onrender.com/api",
  withCredentials: true, // এটি কুকি পাঠানোর জন্য সবচেয়ে জরুরি
  headers: {
    "Content-Type": "application/json",
  },
});

// ২. রিকোয়েস্ট ইন্টারসেপ্টর: ব্রাউজারকে বাধ্য করবে কুকি পাঠাতে
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ৩. রেসপন্স ইন্টারসেপ্টর: ৪০১ হলে লুপ না করে হ্যান্ডেল করবে
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // যদি ৪০১ (Unauthorized) এরর হয়
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // লুপ আটকানোর জন্য ফ্ল্যাগ
      originalRequest._retry = true;

      try {
        // নতুন এক্সেস টোকেন পাওয়ার চেষ্টা করবে
        await axios.get("https://mcdpos.onrender.com/api/auth/refresh", {
          withCredentials: true,
        });
        
        // সফল হলে আগের রিকোয়েস্টটি আবার পাঠাবে
        return api(originalRequest);
      } catch (refreshError) {
        // রিফ্রেশ ফেইল করলে ইউজারকে লগইন পেজে পাঠিয়ে দেবে
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;