import React, { useState, useEffect } from "react";
import supplierApi from "../../api/supplier.service";
import productApi from "../../api/product.service";
import purchaseApi from "../../api/purchase.api";
import { toast } from "react-hot-toast";

const PurchaseForm = ({ onSave, initialData, isEditing, setIsEditing }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoiceData, setInvoiceData] = useState({ supplier: "" });
  const [items, setItems] = useState([{ product: "", quantity: "", buyingPrice: "" }]);

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
    setItems([{ product: "", quantity: "", buyingPrice: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceData.supplier) return toast.error("Please select a supplier.");
    for (const item of items) {
      if (!item.product) return toast.error("Please select a product for all items.");
      if (!item.quantity || Number(item.quantity) <= 0) return toast.error("Quantity must be greater than 0.");
      if (!item.buyingPrice || Number(item.buyingPrice) <= 0) return toast.error("Price must be greater than 0.");
    }

    try {
      // ডেটা সাবমিট করার সময় সঠিক ফরম্যাটে কনভার্ট করা
      const processedItems = items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        buyingPrice: Number(item.buyingPrice)
      }));

      const payload = { ...invoiceData, items: processedItems };
      if (isEditing) await purchaseApi.updatePurchase(initialData._id, payload);
      else await purchaseApi.createPurchase(payload);
      
      toast.success(isEditing ? "Updated successfully!" : "Created successfully!");
      onSave();
      setIsEditing(false);
      resetForm();
    } catch (err) { 
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to save. Check your inputs.";
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-8 border-b pb-4">
        {isEditing ? "Edit Purchase Record" : "Add New Purchase"}
      </h3>
      
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-3">Select Supplier</label>
        <select required value={invoiceData.supplier} onChange={(e) => setInvoiceData({supplier: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:ring-4 focus:ring-blue-50 outline-none transition duration-200">
          <option value="">-- Choose Supplier --</option>
          {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Product</label>
              <select required value={item.product} onChange={(e) => {
                const newItems = [...items]; newItems[idx].product = e.target.value; setItems(newItems);
              }} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400">
                <option value="">Select Product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qty</label>
              <input type="number" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400" value={item.quantity} onChange={(e) => {
                const newItems = [...items]; newItems[idx].quantity = e.target.value; setItems(newItems);
              }} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</label>
              <input type="number" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400" value={item.buyingPrice} onChange={(e) => {
                const newItems = [...items]; newItems[idx].buyingPrice = e.target.value; setItems(newItems);
              }} />
            </div>
            <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-50 font-bold p-3 rounded-lg transition duration-200">Remove</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setItems([...items, { product: "", quantity: "", buyingPrice: "" }])} className="mt-6 flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition">
        <span className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-lg">+</span> Add Another Product
      </button>
      
      <div className="mt-10 flex gap-4">
        {isEditing && (
          <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
        )}
        <button type="submit" className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          {isEditing ? "Update Purchase Record" : "Save Purchase Record"}
        </button>
      </div>
    </form>
  );
};
export default PurchaseForm;