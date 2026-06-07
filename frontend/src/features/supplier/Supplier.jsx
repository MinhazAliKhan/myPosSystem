import React, { useState, useEffect } from "react";
import supplierApi from "../../api/supplier.service";
import SupplierForm from "./SupplierForm";
import SupplierTable from "./SupplierTable";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-hot-toast";

const Supplier = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // সার্চ ও প্যাজিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage, searchTerm]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      // রিকোয়েস্ট পাঠানোর সময় search trim করা হচ্ছে
      const params = { 
        page: currentPage, 
        limit, 
        search: searchTerm.trim() 
      };
      const response = await supplierApi.getAll(params);
      
      // ব্যাকএন্ডের রেসপন্স ফরম্যাট অনুযায়ী সেট করা
      setSuppliers(response.data.suppliers || []);
      setTotalSuppliers(response.data.total || 0);
    } catch (err) {
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await supplierApi.create(data);
      toast.success("Supplier created!");
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await supplierApi.update(id, data);
      toast.success("Supplier updated!");
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await supplierApi.delete(id);
      toast.success("Supplier deleted!");
      fetchSuppliers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Suppliers ({totalSuppliers})</h2>
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="p-2 border rounded w-64 outline-none focus:ring-1 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // সার্চ করলে ১ নম্বর পেজে নিয়ে আসবে
          }}
        />
      </div>

      <SupplierForm 
        onCreate={handleCreate} 
        onUpdate={handleUpdate} 
        editingSupplier={editingSupplier} 
        clearEdit={() => setEditingSupplier(null)} 
      />

      {loading ? (
        <div className="text-center py-10 font-semibold">Loading...</div>
      ) : (
        <>
          <SupplierTable 
            suppliers={suppliers} 
            onEdit={setEditingSupplier} 
            onDelete={handleDelete} 
            userRole={user?.role} 
          />
          
          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="px-4 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="text-sm font-medium">Page {currentPage} of {Math.ceil(totalSuppliers / limit) || 1}</span>
            <button 
              disabled={currentPage >= Math.ceil(totalSuppliers / limit)} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="px-4 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Supplier;