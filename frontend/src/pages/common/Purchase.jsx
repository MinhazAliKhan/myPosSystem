import React, { useState, useEffect } from "react";
import purchaseApi from "../../api/purchase.api";
import supplierApi from "../../api/supplier.service";
import PurchaseForm from "./PurchaseForm";
import PurchaseTable from "./PurchaseTable";
import { toast } from "react-hot-toast";

const PurchasePage = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [supplierFilter, setSupplierFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 5;

  const refreshPurchases = async () => {
    try {
      setLoading(true);
      const [res, sRes] = await Promise.all([
        purchaseApi.getAllPurchases({ page: currentPage, limit, supplier: supplierFilter, startDate, endDate }),
        supplierApi.getAll()
      ]);
      setPurchases(res.data.data || []);
      setTotal(res.data.total || 0);
      setSuppliers(sRes.data.suppliers || []);
    } catch (err) { 
      console.error("Purchase Load Error:", err);
      toast.error("Error loading data"); 
    }
    finally { setLoading(false); }
  };

  useEffect(() => { refreshPurchases(); }, [currentPage, supplierFilter, startDate, endDate]);

  const handleEdit = (data) => {
    setEditingData(data);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this purchase? Stock will be adjusted!")) {
      try {
        await purchaseApi.deletePurchase(id);
        toast.success("Deleted successfully!");
        refreshPurchases();
      } catch (err) { 
        console.error("Delete Error:", err);
        toast.error("Delete failed"); 
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Total Purchases ({total})</h2>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border p-2 rounded-lg" value={supplierFilter} onChange={e => { setSupplierFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Suppliers</option>
          {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input type="date" className="border p-2 rounded-lg" onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} />
        <input type="date" className="border p-2 rounded-lg" onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} />
      </div>

      <PurchaseForm 
        onSave={refreshPurchases} 
        initialData={editingData} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
      />
      
      {loading ? <p className="text-center py-10">Loading...</p> : (
        <>
          <PurchaseTable purchases={purchases} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
          <div className="flex justify-center mt-6 gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="border px-6 py-2 rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-50">Prev</button>
            <span className="py-2 px-4 font-bold">Page {currentPage}</span>
            <button disabled={purchases.length < limit} onClick={() => setCurrentPage(p => p + 1)} className="border px-6 py-2 rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
};
export default PurchasePage;