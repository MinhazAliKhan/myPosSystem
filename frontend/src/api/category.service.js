import api from "./api";

const categoryApi = {
  // params রিসিভ করা এবং axios-এ পাস করা নিশ্চিত করুন
  getAll: (params) => api.get("/v1/categories/getCategories", { params }),
  getOne: (id) => api.get(`/v1/categories/getCategory/${id}`),
  create: (data) => api.post("/v1/categories/createCategory", data),
  update: (id, data) => api.patch(`/v1/categories/updateCategory/${id}`, data),
  delete: (id) => api.delete(`/v1/categories/deleteCategory/${id}`),
};

export default categoryApi;