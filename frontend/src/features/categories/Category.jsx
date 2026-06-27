import React, { useState, useEffect } from "react";
import categoryApi from "../../api/category.service";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-hot-toast";

const Category = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // সার্চ ও প্যাজিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit, search: searchTerm };
      const response = await categoryApi.getAll(params);
      setCategories(response.data.data);
      setTotalCategories(response.data.total);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await categoryApi.create(data);
      toast.success("Category created!");
      fetchCategories();
    } catch (err) { toast.error("Create failed"); }
  };

  const handleUpdate = async (id, data) => {
    try {
      await categoryApi.update(id, data);
      toast.success("Category updated!");
      setEditingCategory(null);
      fetchCategories();
    } catch (err) { toast.error("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await categoryApi.delete(id);
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories ({totalCategories})</h2>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded w-64 outline-none"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <CategoryForm 
        onCreate={handleCreate} 
        onUpdate={handleUpdate} 
        editingCategory={editingCategory} 
        clearEdit={() => setEditingCategory(null)} 
      />

      {loading ? <p>Loading...</p> : (
        <>
          <CategoryTable 
            categories={categories} 
            onEdit={setEditingCategory} 
            onDelete={handleDelete} 
            userRole={user?.role} 
          />
          
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-1 border rounded disabled:opacity-50">Prev</button>
            <span>Page {currentPage} of {Math.ceil(totalCategories / limit) || 1}</span>
            <button disabled={currentPage >= Math.ceil(totalCategories / limit)} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;