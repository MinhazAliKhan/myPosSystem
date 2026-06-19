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
      setItems(initialData.items);
    } else {
      setInvoiceData({ supplier: "" });
      setItems([{ product: "", quantity: 0, buyingPrice: 0 }]);
    }
  }, [isEditing, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedItems = items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      buyingPrice: Number(item.buyingPrice)
    }));

    try {
      if (isEditing) await purchaseApi.updatePurchase(initialData._id, { ...invoiceData, items: processedItems });
      else await purchaseApi.createPurchase({ ...invoiceData, items: processedItems });
      
      toast.success(isEditing ? "Updated successfully!" : "Created successfully!");
      onSave();
      setIsEditing(false);
      setInvoiceData({ supplier: "" });
      setItems([{ product: "", quantity: 0, buyingPrice: 0 }]);
    } catch (err) { toast.error("Error occurred"); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
        {isEditing ? "Edit Purchase Record" : "Add New Purchase"}
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">Select Supplier</label>
        <select required value={invoiceData.supplier} onChange={(e) => setInvoiceData({supplier: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">-- Choose Supplier --</option>
          {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-xl">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Product</label>
              <select required value={item.product?._id || item.product} onChange={(e) => {
                const newItems = [...items]; newItems[idx].product = e.target.value; setItems(newItems);
              }} className="w-full p-2 border rounded-lg outline-none">
                <option value="">Select Product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Qty</label>
              <input type="number" className="w-full p-2 border rounded-lg outline-none" value={item.quantity} onChange={(e) => {
                const newItems = [...items]; newItems[idx].quantity = e.target.value; setItems(newItems);
              }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price</label>
              <input type="number" className="w-full p-2 border rounded-lg outline-none" value={item.buyingPrice} onChange={(e) => {
                const newItems = [...items]; newItems[idx].buyingPrice = e.target.value; setItems(newItems);
              }} />
            </div>
            <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 font-bold p-2">Remove</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setItems([...items, { product: "", quantity: 0, buyingPrice: 0 }])} className="mt-4 text-blue-600 font-semibold hover:underline">+ Add Another Product</button>
      
      <div className="mt-8 flex gap-4">
        {isEditing && (
          <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">Cancel</button>
        )}
        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200">
          {isEditing ? "Update Record" : "Save Purchase"}
        </button>
      </div>
    </form>
  );
};
export default PurchaseForm;