import api from "./api";

const brandApi = {
  // params হিসেবে { search, page, limit, sortBy, sortOrder } পাঠানো যাবে
  getAll: (params) => api.get("/v1/brands/getBrands", { params }),
  getOne: (id) => api.get(`/v1/brands/getBrand/${id}`),
  create: (data) => api.post("/v1/brands/createBrand", data),
  update: (id, data) => api.patch(`/v1/brands/updateBrand/${id}`, data),
  delete: (id) => api.delete(`/v1/brands/deleteBrand/${id}`),
};

export default brandApi;