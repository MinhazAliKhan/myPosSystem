import axios from "axios";

// আপনার ব্যাকএন্ডের সঠিক URL
const BASE_URL = "https://mcdpos.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // এটি কুকি পাঠানোর জন্য বাধ্যতামূলক
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // যদি ৪০১ এরর হয় এবং এটি রিফ্রেশ টোকেন রিকোয়েস্ট না হয়
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // এখানে সরাসরি 'api.get' ব্যবহার করা হয়েছে, যা উপরের কনফিগারেশন অনুসরণ করবে
        await api.get("/auth/refresh"); 

        // রিফ্রেশ সফল হলে অরিজিনাল রিকোয়েস্টটি আবার চেষ্টা করবে
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid");
        // রিফ্রেশ ব্যর্থ হলে ইউজারকে লগইন পেজে পাঠানোর জন্য এটি রিজেক্ট করা হচ্ছে
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 