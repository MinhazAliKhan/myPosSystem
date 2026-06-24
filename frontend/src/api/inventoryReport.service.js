import api from "./api"; // তোমার প্রজেক্টের axios instance পাথ

const inventoryReportApi = {
  // Inventory Report List
  getInventoryReport: () => api.get("/v1/reports/inventories/list"),
};

export default inventoryReportApi;