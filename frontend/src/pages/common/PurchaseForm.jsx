import React, { useState, useEffect } from "react";
import supplierApi from "../../api/supplier.service";
import productApi from "../../api/product.service";
import purchaseApi from "../../api/purchase.api";
import { toast } from "react-hot-toast";

const PurchaseForm = ({ onSave, initialData, isEditing, setIsEditing }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoiceData, setInvoiceData] = useState({ supplier: "" });
  const [items, setItems] = useState([{ product: "", quantity: 0, buyingPrice: 0 }]);

  useEffect(() => {
    const load = async () => {
      const [sRes, pRes] = await Promise.all([supplierApi.getAll(), productApi.getAllProducts()]);
      setSuppliers(sRes.data.suppliers || []);
      setProducts(pRes.data.products || pRes.data.data || []);
    };
    load();
  }, []);

  useEffect(() => {
    if (isEditing && initialData) {
      setInvoiceData({ supplier: initialData.supplier?._id || initialData.supplier });
      setItems(initialData.items.map(item => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
        buyingPrice: item.buyingPrice
      })));
    } else {
      resetForm();
    }
  }, [isEditing, initialData]);

  const resetForm = () => {
    setInvoiceData({ supplier: "" });
    setItems([{ product: "", quantity: 0, buyingPrice: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ভ্যালিডেশন এবং টাইপ কনভার্সন
    const processedItems = items.map(item => ({
      product: item.product,
      quantity: Number(item.quantity),
      buyingPrice: Number(item.buyingPrice)
    }));

    try {
      const payload = { ...invoiceData, items: processedItems };
      if (isEditing) await purchaseApi.updatePurchase(initialData._id, payload);
      else await purchaseApi.createPurchase(payload);
      
      toast.success(isEditing ? "Updated successfully!" : "Created successfully!");
      onSave();
      setIsEditing(false);
      resetForm();
    } catch (err) { 
      toast.error("Failed to save. Check your inputs.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
      <h3 className="text-lg font-bold text-gray-700 mb-4">{isEditing ? "Edit Purchase" : "Add New Purchase"}</h3>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Supplier</label>
        <select required value={invoiceData.supplier} onChange={(e) => setInvoiceData({supplier: e.target.value})} className="w-full p-2 border rounded-md">
          <option value="">Select Supplier</option>
          {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded border">
            <select required value={item.product} onChange={(e) => {
              const newItems = [...items]; newItems[idx].product = e.target.value; setItems(newItems);
            }} className="flex-1 p-2 border rounded text-sm">
              <option value="">Product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input type="number" placeholder="Qty" className="w-20 p-2 border rounded text-sm" value={item.quantity} onChange={(e) => {
              const newItems = [...items]; newItems[idx].quantity = e.target.value; setItems(newItems);
            }} />
            <input type="number" placeholder="Price" className="w-20 p-2 border rounded text-sm" value={item.buyingPrice} onChange={(e) => {
              const newItems = [...items]; newItems[idx].buyingPrice = e.target.value; setItems(newItems);
            }} />
            <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-500 font-bold px-2">×</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setItems([...items, { product: "", quantity: 0, buyingPrice: 0 }])} className="mt-3 text-sm text-blue-600 font-medium">+ Add Item</button>
      
      <div className="flex gap-2 mt-6">
        {isEditing && <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>}
        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
};
export default PurchaseForm;