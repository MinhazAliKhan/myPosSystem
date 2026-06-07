import React, { useState, useEffect } from "react";
import unitApi from "../../api/unit.service";
import UnitForm from "./UnitForm";
import UnitTable from "./UnitTable";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-hot-toast";

const Unit = () => {
  const { user } = useAuth();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // সার্চ ও প্যাজিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUnits, setTotalUnits] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchUnits();
  }, [currentPage, searchTerm]);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit, search: searchTerm };
      const { data } = await unitApi.getAll(params);
      setUnits(data.data);
      setTotalUnits(data.total);
    } catch (err) {
      toast.error("Failed to load units");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await unitApi.create(formData);
      toast.success("Unit created successfully!");
      fetchUnits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await unitApi.update(id, formData);
      toast.success("Unit updated successfully!");
      setEditingUnit(null);
      fetchUnits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await unitApi.delete(id);
      toast.success("Unit deleted!");
      fetchUnits();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Units ({totalUnits})</h2>
        <input
          type="text"
          placeholder="Search units..."
          className="p-2 border rounded w-64 outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <UnitForm 
        onCreate={handleCreate} 
        onUpdate={handleUpdate} 
        editingUnit={editingUnit} 
        clearEdit={() => setEditingUnit(null)} 
      />

      {loading ? (
        <p className="text-center py-10 font-medium text-green-600">Loading units...</p>
      ) : (
        <>
          <UnitTable 
            units={units} 
            onEdit={setEditingUnit} 
            onDelete={handleDelete} 
            userRole={user?.role} 
          />
          
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="px-4 py-1 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Prev
            </button>
            <span className="font-semibold text-gray-700">
              Page {currentPage} of {Math.ceil(totalUnits / limit) || 1}
            </span>
            <button 
              disabled={currentPage >= Math.ceil(totalUnits / limit)} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="px-4 py-1 bg-white border rounded shadow-sm disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Unit;