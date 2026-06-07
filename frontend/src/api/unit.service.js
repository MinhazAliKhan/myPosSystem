import api from "./api";

const unitApi = {
  // ব্যাকএন্ডের /getUnits রাউটের সাথে মিল রেখে
  getAll: (params) => api.get("/v1/units/getUnits", { params }), 
  getOne: (id) => api.get(`/v1/units/getUnit/${id}`),
  create: (data) => api.post("/v1/units/createUnit", data),
  update: (id, data) => api.patch(`/v1/units/updateUnit/${id}`, data),
  delete: (id) => api.delete(`/v1/units/deleteUnit/${id}`),
};

export default unitApi;