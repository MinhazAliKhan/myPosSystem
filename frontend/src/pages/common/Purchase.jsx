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
    } catch (err) { toast.error("Error loading data"); }
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
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Total Purchases ({total})</h2>
      
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="border p-2 rounded" value={supplierFilter} onChange={e => { setSupplierFilter(e.target.value); setCurrentPage(1); }}>
          <option value="">All Suppliers</option>
          {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <input type="date" className="border p-2 rounded" onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} />
        <input type="date" className="border p-2 rounded" onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} />
      </div>

      <PurchaseForm onSave={refreshPurchases} initialData={editingData} isEditing={isEditing} setIsEditing={setIsEditing} />
      
      {loading ? <p>Loading...</p> : (
        <>
          <PurchaseTable purchases={purchases} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="flex justify-center mt-4 gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="border px-4 py-1">Prev</button>
            <span className="py-1">Page {currentPage}</span>
            <button disabled={purchases.length < limit} onClick={() => setCurrentPage(p => p + 1)} className="border px-4 py-1">Next</button>
          </div>
        </>
      )}
    </div>
  );
};
export default PurchasePage;