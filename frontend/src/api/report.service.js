import api from "./api"; // যদি report.service.js এবং api.js একই ফোল্ডারে থাকে

const reportApi = {
  // Drawer Report
  getDrawerReport: (params) => api.get("/v1/reports/drawer", { params }),

  // Shift Report
  getShiftReport: (params) => api.get("/v1/reports/shift", { params }),

  // Daily Summary
  getDailySummaryReport: (params) => api.get("/v1/reports/daily-summary", { params }),

  // Monthly Summary
  getMonthlySummary: (params) => api.get("/v1/reports/monthly-summary", { params }),
  getMonthlySummaryReport: (params) => api.get("/v1/reports/monthly-summary", { params }),
};

export default reportApi;