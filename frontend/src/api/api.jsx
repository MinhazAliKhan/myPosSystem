import axios from "axios";

const api = axios.create({
  baseURL: "https://mcdpos.onrender.com/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // যদি 401 হয় এবং আগে রিফ্রেশ চেষ্টা না করা হয়ে থাকে
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // যদি রিকোয়েস্টটি অলরেডি রিফ্রেশ রাউটের হয়, তবে লুপ না করে সরাসরি লগআউট
      if (originalRequest.url.includes("/auth/refresh")) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.get("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;