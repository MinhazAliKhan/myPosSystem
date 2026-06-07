import React, { useState, useEffect } from "react";

const BrandForm = ({ onCreate, onUpdate, editingBrand, clearEdit }) => {
  const [formData, setFormData] = useState({ name: "", description: "", isActive: true });

  useEffect(() => {
    if (editingBrand) {
      setFormData({
        name: editingBrand.name,
        description: editingBrand.description || "",
        isActive: editingBrand.isActive
      });
    } else {
      setFormData({ name: "", description: "", isActive: true });
    }
  }, [editingBrand]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBrand) {
      onUpdate(editingBrand._id, formData);
    } else {
      onCreate(formData);
    }
    setFormData({ name: "", description: "", isActive: true });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border-t-4 border-blue-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Brand Name"
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
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="mr-2"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          Active
        </label>
        <div className="flex gap-2">
          {editingBrand && (
            <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
          )}
          <button type="submit" className="bg-blue-600 text-white px-6 py-1 rounded font-bold">
            {editingBrand ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BrandForm;