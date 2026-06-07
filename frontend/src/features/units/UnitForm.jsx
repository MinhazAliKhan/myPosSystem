import React, { useState, useEffect } from "react";

const UnitForm = ({ onCreate, onUpdate, editingUnit, clearEdit }) => {
  const [formData, setFormData] = useState({ name: "", shortName: "", isActive: true });

  useEffect(() => {
    if (editingUnit) {
      setFormData({
        name: editingUnit.name,
        shortName: editingUnit.shortName,
        isActive: editingUnit.isActive
      });
    } else {
      setFormData({ name: "", shortName: "", isActive: true });
    }
  }, [editingUnit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUnit) {
      onUpdate(editingUnit._id, formData);
    } else {
      onCreate(formData);
    }
    setFormData({ name: "", shortName: "", isActive: true });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border-t-4 border-green-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Unit Name (e.g. Kilogram)"
          className="p-2 border rounded outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Short Name (e.g. Kg)"
          className="p-2 border rounded outline-none"
          value={formData.shortName}
          onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
          required
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <label className="flex items-center text-sm cursor-pointer select-none text-gray-600 font-medium">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 accent-green-600"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          Active
        </label>
        <div className="flex gap-2">
          {editingUnit && (
            <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-4 py-1 rounded text-sm hover:bg-gray-500 transition">Cancel</button>
          )}
          <button type="submit" className="bg-green-600 text-white px-6 py-1 rounded font-bold hover:bg-green-700 transition">
            {editingUnit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UnitForm;