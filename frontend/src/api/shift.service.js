import api from "./api";

const shiftApi = {
  // ১. শিফট ওপেন করা (POST -> /api/v1/shifts/open)
  openShift: (data) => api.post("/v1/shifts/open", data),

  // ২. ড্রয়ার সেশন ওপেন করা (POST -> /api/v1/shifts/drawer/open)
  openDrawer: (data) => api.post("/v1/shifts/drawer/open", data),

  // ৩. ড্রয়ার সেশন ক্লোজ করা (PATCH -> /api/v1/shifts/drawer/:id/close)
  closeDrawer: (id, data) => api.patch(`/v1/shifts/drawer/${id}/close`, data),

  // ৪. পুরো শিফটটি ফাইনাল ক্লোজ করা (POST -> /api/v1/shifts/:id/close)
  // আপনার রাউটারে এটি router.post দেওয়া আছে, তাই এখানেpost ব্যবহার করা হলো
  closeShift: (id, data) => api.post(`/v1/shifts/${id}/close`, data),

  // ৫. শিফটের অডিট রিপোর্ট দেখা (GET -> /api/v1/shifts/:id/audit)
  getAuditReport: (id) => api.get(`/v1/shifts/${id}/audit`),

  getCurrentStatus: () => api.get("/v1/shifts/current-status"),
  getCurrentStatus: () => api.get("/v1/shifts/current"),
};

export default shiftApi;