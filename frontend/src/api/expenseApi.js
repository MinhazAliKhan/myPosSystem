import api from "./api";

const expenseApi = {
  // যেহেতু server.js এ /api/v1/expenses সেট করা আছে, 
  // আর api.js এ baseURL আছে /api, 
  // তাই এখানে শুধু /v1/expenses দিলেই কাজ করবে।
  
  getAll: (params) => api.get("/v1/expenses", { params }), 
  getOne: (id) => api.get(`/v1/expenses/${id}`),
  create: (data) => api.post("/v1/expenses", data),
  getShiftStats: (shiftId) => api.get(`/v1/expenses/stats/shift/${shiftId}`),
};

export default expenseApi;