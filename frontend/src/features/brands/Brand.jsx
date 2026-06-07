import React, { useState, useEffect } from "react";
import brandApi from "../../api/brand.service";
import BrandForm from "./BrandForm";
import BrandTable from "./BrandTable";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-hot-toast";

const Brand = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  // সার্চ ও প্যাজিনেশন স্টেট (Category এর মতো হুবহু সাইজ)
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit, search: searchTerm };
      const response = await brandApi.getAll(params);
      setBrands(response.data.data);
      setTotalBrands(response.data.total);
    } catch (err) {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await brandApi.create(data);
      toast.success("Brand created!");
      fetchBrands();
    } catch (err) { toast.error("Create failed"); }
  };

  const handleUpdate = async (id, data) => {
    try {
      await brandApi.update(id, data);
      toast.success("Brand updated!");
      setEditingBrand(null);
      fetchBrands();
    } catch (err) { toast.error("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await brandApi.delete(id);
      toast.success("Brand deleted!");
      fetchBrands();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-6"> {/* আপনার ক্যাটাগরির মতো প্যাডিং */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Brands ({totalBrands})</h2>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-64 outline-none" // হুবহু একই উইডথ (w-64)
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <BrandForm 
        onCreate={handleCreate} 
        onUpdate={handleUpdate} 
        editingBrand={editingBrand} 
        clearEdit={() => setEditingBrand(null)} 
      />

      {loading ? <p>Loading...</p> : (
        <>
          <BrandTable 
            brands={brands} 
            onEdit={setEditingBrand} 
            onDelete={handleDelete} 
            userRole={user?.role} 
          />
          
          {/* প্যাজিনেশন UI আপনার ক্যাটাগরির লজিক অনুযায়ী */}
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            
            <span>Page {currentPage} of {Math.ceil(totalBrands / limit) || 1}</span>
            
            <button 
              disabled={currentPage >= Math.ceil(totalBrands / limit)} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Brand;