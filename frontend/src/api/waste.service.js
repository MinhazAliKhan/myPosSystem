import api from "./api";

const wasteApi = {
  // ব্যাকএন্ড রাউট: /api/v1/waste/report
  getWasteRecords: (params) => api.get("/v1/waste/report", { params }),

  // ব্যাকএন্ড রাউট: /api/v1/waste/bulk-entry
  recordBulkWaste: (data) => api.post("/v1/waste/bulk-entry", data)
};

export default wasteApi;