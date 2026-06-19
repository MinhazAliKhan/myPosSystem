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
    try {
      const data = { ...invoiceData, items };
      if (isEditing) await purchaseApi.updatePurchase(initialData._id, data);
      else await purchaseApi.createPurchase(data);
      
      toast.success(isEditing ? "Updated!" : "Created!");
      onSave();
      setIsEditing(false);
      setInvoiceData({ supplier: "" });
      setItems([{ product: "", quantity: 0, buyingPrice: 0 }]);
    } catch (err) { toast.error("Error occurred"); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 border">
      <h3 className="font-bold mb-4">{isEditing ? "Edit" : "Add"} Purchase</h3>
      <select required value={invoiceData.supplier} onChange={(e) => setInvoiceData({supplier: e.target.value})} className="border p-2 w-full mb-4 rounded">
        <option value="">Select Supplier</option>
        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
      </select>
      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
          <select required value={item.product?._id || item.product} onChange={(e) => {
            const newItems = [...items]; newItems[idx].product = e.target.value; setItems(newItems);
          }} className="border p-2 rounded">
            <option value="">Product</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Qty" className="border p-2 rounded" value={item.quantity} onChange={(e) => {
            const newItems = [...items]; newItems[idx].quantity = e.target.value; setItems(newItems);
          }} />
          <input type="number" placeholder="Price" className="border p-2 rounded" value={item.buyingPrice} onChange={(e) => {
            const newItems = [...items]; newItems[idx].buyingPrice = e.target.value; setItems(newItems);
          }} />
          <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="bg-red-500 text-white p-2 rounded">X</button>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, { product: "", quantity: 0, buyingPrice: 0 }])} className="bg-green-500 text-white px-4 py-2 rounded">+ Row</button>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">{isEditing ? "Update" : "Save"}</button>
    </form>
  );
};
export default PurchaseForm;