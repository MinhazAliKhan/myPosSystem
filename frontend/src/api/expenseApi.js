import api from "./api";

const expenseApi = {
  /**
   * সব খরচ দেখা
   */
  getAll: (params) => api.get("/v1/expenses", { params }),

  /**
   * নির্দিষ্ট একটি খরচের বিস্তারিত দেখা
   */
  getOne: (id) => api.get(`/v1/expenses/${id}`),

  /**
   * নতুন খরচ তৈরি করা
   */
  create: (data) => api.post("/v1/expenses", data),

  /**
   * খরচ আপডেট করা
   */
  update: (id, data) => api.patch(`/v1/expenses/${id}`, data),

  /**
   * খরচ ডিলিট করা
   */
  delete: (id) => api.delete(`/v1/expenses/${id}`),

  /**
   * নির্দিষ্ট শিফটের মোট খরচের সামারি
   * ইউআরএলটি আপনার server.js এর সাথে মিলিয়ে /v1/expenses রাখা হয়েছে
   */
  getShiftStats: (shiftId) => api.get(`/v1/expenses/stats/shift/${shiftId}`),
};

export default expenseApi;