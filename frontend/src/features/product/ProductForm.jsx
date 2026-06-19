import React, { useState, useEffect } from "react";
import categoryApi from "../../api/category.service";
import brandApi from "../../api/brand.service";
import unitApi from "../../api/unit.service";

const ProductForm = ({ onCreate, onUpdate, editingProduct, clearEdit }) => {
  // আপনার আগের স্টেট লজিক হুবহু রাখা হয়েছে
  const [formData, setFormData] = useState({ 
    name: "", 
    sku: "", 
    price: "", 
    costPrice: "", 
    category: "", 
    brand: "", 
    unit: "", 
    stock: "" 
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
        stock: editingProduct.stock || ""
      });
    } else {
      setFormData({ name: "", sku: "", price: "", costPrice: "", category: "", brand: "", unit: "", stock: "" });
    }
  }, [editingProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      price: Number(formData.price),
      costPrice: formData.costPrice === "" ? 0 : Number(formData.costPrice),
      stock: formData.stock === "" ? 0 : Number(formData.stock),
      sku: formData.sku.trim() === "" ? `SKU-${Date.now().toString().slice(-6)}` : formData.sku
    };

    if (finalData.costPrice > finalData.price) {
      alert("Cost price cannot be greater than selling price!");
      return;
    }

    editingProduct ? onUpdate(editingProduct._id, finalData) : onCreate(finalData);
    
    if(!editingProduct) {
      setFormData({ name: "", sku: "", price: "", costPrice: "", category: "", brand: "", unit: "", stock: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 border-t-4 border-blue-500">
      {/* grid-cols-1 md:grid-cols-3 ক্লাসটি রেসপন্সিভ কাজের জন্য রাখা হয়েছে */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        
        <input 
          type="text" 
          placeholder="Product Name (e.g. Coca Cola)" 
          className="p-2 border rounded outline-none focus:border-blue-400 w-full" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        
        <select className="p-2 border rounded outline-none focus:border-blue-400 w-full" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
          <option value="">-- Select Category --</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select className="p-2 border rounded outline-none focus:border-blue-400 w-full" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required>
          <option value="">-- Select Brand --</option>
          {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>

        <select className="p-2 border rounded outline-none focus:border-blue-400 w-full" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required>
          <option value="">-- Select Unit --</option>
          {units.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>

        <input 
          type="number" 
          placeholder="Selling Price (MRP)" 
          className="p-2 border rounded outline-none focus:border-blue-400 w-full" 
          value={formData.price} 
          onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
          required 
        />

        <input 
          type="number" 
          placeholder="Cost Price (Buy Price)" 
          className="p-2 border rounded outline-none focus:border-blue-400 w-full" 
          value={formData.costPrice} 
          onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} 
        />
        
        <input 
          type="number" 
          placeholder="Opening Stock Qty" 
          className="p-2 border rounded outline-none focus:border-blue-400 w-full" 
          value={formData.stock} 
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
        />

        <input 
          type="text" 
          placeholder="SKU Code (Optional)" 
          className="p-2 border rounded outline-none focus:border-blue-400 w-full" 
          value={formData.sku} 
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })} 
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        {editingProduct && (
          <button type="button" onClick={clearEdit} className="bg-gray-400 text-white px-5 py-2 rounded font-bold transition hover:bg-gray-500">
            Cancel
          </button>
        )}
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded font-bold transition hover:bg-blue-700 shadow-md">
          {editingProduct ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;