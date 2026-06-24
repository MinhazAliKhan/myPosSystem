import React, { useState, useEffect } from "react";
import categoryApi from "../../api/category.service";
import brandApi from "../../api/brand.service";
import unitApi from "../../api/unit.service";

const ProductForm = ({ onCreate, onUpdate, editingProduct, clearEdit }) => {
  const [formData, setFormData] = useState({ 
    name: "", sku: "", price: "", costPrice: "", category: "", brand: "", unit: "", stock: "", lowStockLevel: 5 
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    categoryApi.getAll().then(res => setCategories(res.data.data || []));
    brandApi.getAll().then(res => setBrands(res.data.data || []));
    unitApi.getAll().then(res => setUnits(res.data.data || []));
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku || "",
        price: editingProduct.price,
        costPrice: editingProduct.costPrice || "",
        category: editingProduct.category?._id || editingProduct.category,
        brand: editingProduct.brand?._id || editingProduct.brand,
        unit: editingProduct.unit?._id || editingProduct.unit,
        stock: editingProduct.stock || "",
        lowStockLevel: editingProduct.lowStockLevel || 5
      });
    } else {
      setFormData({ name: "", sku: "", price: "", costPrice: "", category: "", brand: "", unit: "", stock: "", lowStockLevel: 5 });
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      price: Number(formData.price),
      costPrice: formData.costPrice === "" ? 0 : Number(formData.costPrice),
      stock: formData.stock === "" ? 0 : Number(formData.stock),
      lowStockLevel: Number(formData.lowStockLevel) || 5,
      sku: formData.sku.trim() === "" ? `SKU-${Date.now().toString().slice(-6)}` : formData.sku
    };

    if (finalData.costPrice > finalData.price) {
      alert("Cost price cannot be greater than selling price!");
      return;
    }

    editingProduct ? onUpdate(editingProduct._id, finalData) : onCreate(finalData);
    if(!editingProduct) {
      setFormData({ name: "", sku: "", price: "", costPrice: "", category: "", brand: "", unit: "", stock: "", lowStockLevel: 5 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border-t-4 border-blue-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Product Name</label>
          <input type="text" className="p-2 border rounded outline-none w-full" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
          <select className="p-2 border rounded outline-none w-full" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
            <option value="">-- Select --</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Brand</label>
          <select className="p-2 border rounded outline-none w-full" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required>
            <option value="">-- Select --</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Unit</label>
          <select className="p-2 border rounded outline-none w-full" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required>
            <option value="">-- Select --</option>
            {units.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Selling Price</label>
          <input type="number" className="p-2 border rounded outline-none w-full" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Cost Price</label>
          <input type="number" className="p-2 border rounded outline-none w-full" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Opening Stock</label>
          <input type="number" className="p-2 border rounded outline-none w-full" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-blue-600 uppercase">Alert At (Low Stock):</label>
          <input type="number" className="p-2 border rounded outline-none w-full bg-blue-50 border-blue-200" value={formData.lowStockLevel} onChange={(e) => setFormData({ ...formData, lowStockLevel: e.target.value })} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">SKU Code</label>
          <input type="text" className="p-2 border rounded outline-none w-full" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {editingProduct && <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-5 py-2 rounded font-bold">Cancel</button>}
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded font-bold">{editingProduct ? "Update Product" : "Save Product"}</button>
      </div>
    </form>
  );
};
export default ProductForm;