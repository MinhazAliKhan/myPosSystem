import api from "./api";

const supplierApi = {
  // params: { search, page, limit }
  getAll: (params) => api.get("/v1/suppliers", { params }),
  getOne: (id) => api.get(`/v1/suppliers/${id}`),
  create: (data) => api.post("/v1/suppliers", data),
  update: (id, data) => api.patch(`/v1/suppliers/${id}`, data),
  delete: (id) => api.delete(`/v1/suppliers/${id}`),
};

export default supplierApi;