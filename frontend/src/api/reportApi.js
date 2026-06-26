import api from "./api";

const reportApi = {
  // সেলসম্যান রিপোর্ট (v1 ভার্সন অনুযায়ী)
  getSalesmanSummary: () => api.get("/v1/reports/salesman/summary"),

  // অ্যাডমিন রিপোর্ট (v1 ভার্সন অনুযায়ী)
  getAdminSummary: (params) => api.get("/v1/reports/admin/admin-summary", { params }),
};

export default reportApi;