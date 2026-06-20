import React, { useState, useEffect } from "react";
import productApi from "../../../api/product.service";
import refundApi from "../../../api/refund.service";
import { toast } from "react-hot-toast";

const RefundForm = ({ onSave }) => {
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ saleId: "", reason: "" });
  const [items, setItems] = useState([{ product: "", quantity: "", price: "" }]);

  useEffect(() => {
    productApi.getAllProducts().then(res => setProducts(res.data.products || res.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.reason || formData.reason.length < 5) return toast.error("Please provide a valid reason (min 5 chars).");

    setIsSubmitting(true);
    try {
      const payload = { ...formData, items };
      await refundApi.createRefund(payload);
      toast.success("Refund processed successfully!");
      onSave();
      setFormData({ saleId: "", reason: "" });
      setItems([{ product: "", quantity: "", price: "" }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process refund.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-8 border-b pb-4">Process New Refund</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Sale Invoice ID (Optional)" className="p-4 border rounded-xl" onChange={e => setFormData({...formData, saleId: e.target.value})} />
        <input type="text" placeholder="Reason for refund" className="p-4 border rounded-xl" required onChange={e => setFormData({...formData, reason: e.target.value})} />
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-2xl">
            <select 
              className="md:col-span-2 p-3 border rounded-lg" 
              value={item.product} 
              onChange={e => { 
                const selectedProductId = e.target.value;
                const selectedProduct = products.find(p => p._id === selectedProductId);
                const n = [...items]; 
                n[idx].product = selectedProductId; 
                // প্রোডাক্ট সিলেক্ট করলে অটোমেটিক প্রাইস সেট হবে
                n[idx].price = selectedProduct ? (selectedProduct.price || 0) : ""; 
                setItems(n); 
              }}
            >
              <option value="">Select Product</option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <input type="number" placeholder="Qty" className="p-3 border rounded-lg" value={item.quantity} onChange={e => { const n = [...items]; n[idx].quantity = Number(e.target.value); setItems(n); }} />
            <input type="number" placeholder="Price" className="p-3 border rounded-lg" value={item.price} onChange={e => { const n = [...items]; n[idx].price = Number(e.target.value); setItems(n); }} />
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setItems([...items, { product: "", quantity: "", price: "" }])} className="mt-4 text-blue-600 font-bold">+ Add Item</button>
      <button type="submit" disabled={isSubmitting} className="w-full mt-6 p-4 bg-blue-600 text-white rounded-xl font-bold">Process Refund</button>
    </form>
  );
};
export default RefundForm;