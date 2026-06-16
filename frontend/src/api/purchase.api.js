import api from "./api";

const purchaseApi = {
  /**
   * সব পারচেজ লিস্ট দেখা
   */
  getAllPurchases: (params) => api.get("/v1/purchases", { params }),

  /**
   * নির্দিষ্ট একটি পারচেজ ডিটেইলস দেখা
   */
  getSinglePurchase: (id) => api.get(`/v1/purchases/${id}`),

  /**
   * নতুন পারচেজ রেকর্ড করা
   * রুট: router.post("/create", ...)
   */
  createPurchase: (data) => api.post("/v1/purchases/create", data),

  /**
   * পারচেজ আপডেট করা
   * রুট: router.patch("/update/:id", ...)
   */
  updatePurchase: (id, data) => api.patch(`/v1/purchases/update/${id}`, data),

  /**
   * পারচেজ ডিলিট করা
   */
  deletePurchase: (id) => api.delete(`/v1/purchases/delete/${id}`),
};

export default purchaseApi;