import React, { useState, useEffect } from "react";
import purchaseApi from "../../api/purchase.api";
import supplierApi from "../../api/supplier.service"; // সাপ্লায়ার লিস্টের জন্য
import PurchaseForm from "./PurchaseForm";
import PurchaseTable from "./PurchaseTable";
import { toast } from "react-hot-toast";

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // নতুন: সাপ্লায়ার লিস্টের জন্য
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const [supplier, setSupplier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, [currentPage, supplier, startDate, endDate]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      
      // একই সাথে সাপ্লায়ার লিস্ট এবং পারচেজ লিস্ট লোড করা
      const [res, sRes] = await Promise.all([
        purchaseApi.getAllPurchases({ page: currentPage, limit, supplier, startDate, endDate }),
        supplierApi.getAll()
      ]);

      setPurchases(res.data.data || []);
      setTotal(res.data.total || 0);
      setSuppliers(sRes.data.suppliers || []); // ব্যাক-এন্ড রেসপন্স অনুযায়ী
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? Stock will be adjusted!")) return;
    try {
      await purchaseApi.deletePurchase(id);
      toast.success("Deleted successfully!");
      fetchPurchases();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Total Purchases ({total})</h2>
      
      {/* ফিল্টার সেকশন */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* সাপ্লায়ার আইডি এর বদলে এখন ড্রপডাউন */}
        <select 
          className="border p-2 rounded" 
          value={supplier}
          onChange={e => { setSupplier(e.target.value); setCurrentPage(1); }} 
        >
          <option value="">All Suppliers</option>
          {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <input type="date" className="border p-2 rounded" onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} />
        <input type="date" className="border p-2 rounded" onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} />
      </div>
      
      <PurchaseForm onSave={fetchPurchases} />
      
      {loading ? <p>Loading...</p> : (
        <>
          <PurchaseTable purchases={purchases} onDelete={handleDelete} />
          <div className="flex justify-center mt-4 gap-2">
            <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="border px-4 py-1 disabled:opacity-50"
            >
                Prev
            </button>
            <span className="py-1">Page {currentPage}</span>
            <button 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="border px-4 py-1"
            >
                Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default Purchase;