import api from "./api";

const saleApi = {
  // --- Shift Endpoints ---
  getCurrentShift: () => api.get("/v1/shifts/current"),
  openShift: () => api.post("/v1/shifts/open"),
  closeShift: (data) => api.post("/v1/shifts/close", data),

  // --- Sales Endpoints ---
  // Route: POST /api/v1/sales/create
  createSale: (saleData) => api.post("/v1/sales/create", saleData),
  
  // Route: GET /api/v1/sales
  getSales: (params) => api.get("/v1/sales", { params }),

  // Route: PATCH /api/v1/sales/:id/void
  voidSale: (id, reason) => api.patch(`/v1/sales/${id}/void`, { reason }),

  // Route: PATCH /api/v1/sales/:id/refund
  refundSale: (id, reason) => api.patch(`/v1/sales/${id}/refund`, { reason }),

  // Route: GET /api/v1/sales/top-items
  getTopItems: () => api.get("/v1/sales/top-items"),

  // Route: POST /api/v1/sales/expense
  addExpense: (expenseData) => api.post("/v1/sales/expense", expenseData),

  // --- Kitchen Endpoints ---
  // Route: GET /api/v1/sales/kitchen-orders
  getKitchenOrders: () => api.get("/v1/sales/kitchen-orders"),
  markOrderDone: (id) => api.patch(`/v1/sales/${id}/status`, { status: "delivered" }),
};

export default saleApi;