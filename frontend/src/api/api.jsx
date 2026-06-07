import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // কুকি (HttpOnly) ব্যবহারের জন্য এটি বাধ্যতামূলক
});

// রেসপন্স ইন্টারসেপ্টর: টোকেন এক্সপায়ার হলে হ্যান্ডেল করবে
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // যদি 401 এরর দেয় এবং এটি রিফ্রেশ রুট না হয়, তবে নতুন টোকেন ট্রাই করবে
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // ব্যাকএন্ডের রিফ্রেশ টোকেন রুট কল করা
        await axios.get("http://localhost:5000/api/auth/refresh", {
          withCredentials: true,
        });

        // নতুন টোকেন পাওয়ার পর অরিজিনাল রিকোয়েস্ট আবার পাঠানো
        return api(originalRequest);
      } catch (refreshError) {
        // রিফ্রেশ ফেইল করলে সরাসরি লগআউট বা এরর রিটার্ন
        console.error("Refresh token expired or invalid");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;