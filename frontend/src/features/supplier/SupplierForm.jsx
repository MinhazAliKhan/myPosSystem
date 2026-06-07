import React, { useState, useEffect } from "react";

const SupplierForm = ({ onCreate, onUpdate, editingSupplier, clearEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    contactPerson: "",
  });

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        phone: editingSupplier.phone,
        email: editingSupplier.email || "",
        address: editingSupplier.address || "",
        contactPerson: editingSupplier.contactPerson || "",
      });
    } else {
      setFormData({ name: "", phone: "", email: "", address: "", contactPerson: "" });
    }
  }, [editingSupplier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      onUpdate(editingSupplier._id, formData);
    } else {
      onCreate(formData);
    }
    setFormData({ name: "", phone: "", email: "", address: "", contactPerson: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border-t-4 border-red-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Supplier Name"
          className="p-2 border rounded outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="p-2 border rounded outline-none"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="p-2 border rounded outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact Person"
          className="p-2 border rounded outline-none"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
        />
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Full Address"
            className="p-2 border rounded outline-none w-full"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {editingSupplier && (
          <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-4 py-1 rounded text-sm">
            Cancel
          </button>
        )}
        <button type="submit" className="bg-red-600 text-white px-6 py-1 rounded font-bold hover:bg-red-700 transition">
          {editingSupplier ? "Update Supplier" : "Save Supplier"}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;