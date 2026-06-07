import api from "./api";

const purchaseApi = {
  /**
   * সব পারচেজ লিস্ট দেখা (Pagination & Filter সহ)
   * params: { supplier, status, page, limit }
   */
  getAllPurchases: (params) => api.get("/v1/purchases", { params }),

  /**
   * পারচেজ সামারি দেখা (ড্যাশবোর্ড কার্ডের জন্য)
   */
  getPurchaseSummary: () => api.get("/v1/purchases/summary"),

  /**
   * নির্দিষ্ট একটি পারচেজ ডিটেইলস দেখা
   */
  getSinglePurchase: (id) => api.get(`/v1/purchases/${id}`),

  /**
   * নতুন বাল্ক পারচেজ রেকর্ড করা
   * data: { supplier, status, items: [...] }
   */
  createBulkPurchase: (data) => api.post("/v1/purchases", data),
};

export default purchaseApi;