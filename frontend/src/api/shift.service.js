import api from "./api";

const shiftApi = {
  // ১. বর্তমানে কোনো শিফট ওপেন আছে কি না তা চেক করা
  // Full URL: http://localhost:5000/api/v1/shifts/current
  getCurrentShift: () => api.get("/v1/shifts/current"),

  // ২. শিফট ওপেন করা
  // Full URL: http://localhost:5000/api/v1/shifts/open
  openShift: () => api.post("/v1/shifts/open"),

  // ৩. শিফট ক্লোজ করা
  // Full URL: http://localhost:5000/api/v1/shifts/close
  closeShift: (closingData) => api.post("/v1/shifts/close", closingData),

  // ৪. সব শিফটের লিস্ট দেখা (Admin & Salesman)
  // Full URL: http://localhost:5000/api/v1/shifts
  getAllShifts: (params) => api.get("/v1/shifts", { params }),
};

export default shiftApi;