import api from "./api";

const refundApi = {
  /**
   * সব রিফান্ড রেকর্ড দেখা (ফিল্টার ও পেজিনেশন সহ)
   * রুট: router.get("/")
   */
  getAllRefunds: (params) => api.get("/v1/refunds", { params }),

  /**
   * নির্দিষ্ট একটি রিফান্ড ডিটেইলস দেখা
   * রুট: router.get("/:id")
   */
  getSingleRefund: (id) => api.get(`/v1/refunds/${id}`),

  /**
   * নতুন রিফান্ড রেকর্ড করা
   * রুট: router.post("/create")
   */
  createRefund: (data) => api.post("/v1/refunds/create", data),
};

export default refundApi;