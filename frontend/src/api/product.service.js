import api from "./api"; // আপনার মেইন এক্সিওস ফাইল

const productApi = {
  // ১. সব প্রোডাক্ট দেখা (সার্চ ও প্যাজিনেশন সহ)
  getAllProducts: (params) => api.get("/v1/products/getAllProducts", { params }),

  // ২. নির্দিষ্ট প্রোডাক্ট দেখা
  getProductById: (id) => api.get(`/v1/products/getProduct/${id}`),

  // ৩. নতুন প্রোডাক্ট তৈরি
  createProduct: (data) => api.post("/v1/products/createProduct", data),

  // ৪. প্রোডাক্ট আপডেট
  updateProduct: (id, data) => api.patch(`/v1/products/updateProduct/${id}`, data),

  // ৫. প্রোডাক্ট ডিলিট
  deleteProduct: (id) => api.delete(`/v1/products/deleteProduct/${id}`),
};

// এটিই সবচেয়ে গুরুত্বপূর্ণ লাইন যা আপনার এররটি দূর করবে
export default productApi;