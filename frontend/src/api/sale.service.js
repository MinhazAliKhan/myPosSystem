import api from "./api";

const saleApi = {
  // --- Shift Endpoints ---
  getCurrentShift: () => api.get("/v1/shifts/current"),
  openShift: () => api.post("/v1/shifts/open"),
  closeShift: (data) => api.post("/v1/shifts/close", data),

  // --- Sales Endpoints ---
  // আপনার রাউট অনুযায়ী POST /api/v1/sales/createSale
  createSale: (saleData) => api.post("/v1/sales/createSale", saleData),
  
  // আপনার রাউট অনুযায়ী GET /api/v1/sales
  getSales: (params) => api.get("/v1/sales", { params }),

  // আপনার রাউট অনুযায়ী PATCH /api/v1/sales/:id/void
  voidSale: (id, reason) => api.patch(`/v1/sales/${id}/void`, { reason }),

  // আপনার রাউট অনুযায়ী PATCH /api/v1/sales/:id/refund
  refundSale: (id, reason) => api.patch(`/v1/sales/${id}/refund`, { reason }),
  getTopItems: (shiftId) => api.get(`/v1/sales/top-items/${shiftId}`),
};

export default saleApi;