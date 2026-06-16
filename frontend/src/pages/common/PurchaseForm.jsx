import React, { useState, useEffect } from "react";
import supplierApi from "../../api/supplier.service";
import productApi from "../../api/product.service";
import purchaseApi from "../../api/purchase.api";
import { toast } from "react-hot-toast";

const PurchaseForm = ({ onSave }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ 
    supplier: "", 
    items: [{ product: "", quantity: 0, buyingPrice: 0 }] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          supplierApi.getAll(), 
          productApi.getAllProducts()
        ]);
        setSuppliers(sRes.data.suppliers || []);
        setProducts(pRes.data.products || pRes.data.data || []);
      } catch (err) { 
        console.error(err);
        toast.error("Failed to load dropdowns"); 
      }
    };
    fetchData();
  }, []);

  const addProductRow = () => {
    setFormData({ 
      ...formData, 
      items: [...formData.items, { product: "", quantity: 0, buyingPrice: 0 }] 
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ডাটা প্রসেস এবং টাইপ কনভার্সন
    const processedItems = formData.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      buyingPrice: Number(item.buyingPrice)
    }));

    // ভ্যালিডেশন
    if (!formData.supplier) return toast.error("Select a supplier");
    if (processedItems.some(i => !i.product || i.quantity <= 0 || i.buyingPrice <= 0)) {
      return toast.error("Please fill all fields correctly (Qty & Price > 0)");
    }

    try {
      await purchaseApi.createPurchase({ ...formData, items: processedItems });
      toast.success("Purchase added successfully!");
      onSave();
      setFormData({ supplier: "", items: [{ product: "", quantity: 0, buyingPrice: 0 }] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add purchase");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 border">
      <h3 className="font-bold mb-4">Add New Purchase</h3>
      
      <select required value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} className="border p-2 w-full mb-4 rounded">
        <option value="">Select Supplier</option>
        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>

      {formData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-3 gap-2 mb-2">
          <select required value={item.product} onChange={(e) => handleItemChange(index, 'product', e.target.value)} className="border p-2 rounded">
            <option value="">Select Product</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Qty" className="border p-2 rounded" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
          <input type="number" placeholder="Price" className="border p-2 rounded" value={item.buyingPrice} onChange={(e) => handleItemChange(index, 'buyingPrice', e.target.value)} />
        </div>
      ))}

      <button type="button" onClick={addProductRow} className="bg-green-500 text-white px-4 py-1 rounded mb-4 hover:bg-green-600">+ Add Another Product</button>
      <button type="submit" className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Purchase</button>
    </form>
  );
};

export default PurchaseForm;