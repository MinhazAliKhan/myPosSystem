import React, { useState, useEffect } from "react";

const CategoryForm = ({ onCreate, onUpdate, editingCategory, clearEdit }) => {
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || "",
        isActive: editingCategory.isActive
      });
    } else {
      setFormData({ name: "", description: "", isActive: true });
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdate(editingCategory._id, formData);
    } else {
      onCreate(formData);
    }
    // সাবমিট করার পর ইনপুট ডাটা রিমুভ (Clear) হবে
    setFormData({ name: "", description: "", isActive: true });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border-t-4 border-red-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Category Name"
          className="p-2 border rounded outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border rounded outline-none"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <label className="flex items-center text-sm cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          Active
        </label>
        <div className="flex gap-2">
          {editingCategory && (
            <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-4 py-1 rounded text-sm">Cancel</button>
          )}
          <button type="submit" className="bg-red-600 text-white px-6 py-1 rounded font-bold">
            {editingCategory ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;