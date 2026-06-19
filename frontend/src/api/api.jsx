import axios from "axios";

const api = axios.create({
  baseURL: "https://mcdpos.onrender.com/api",
  withCredentials: true,
});

// ইন্টারসেপ্টর একদম মুছে দিলাম যাতে কোনো অটো-লুপ না হয়
export default api;