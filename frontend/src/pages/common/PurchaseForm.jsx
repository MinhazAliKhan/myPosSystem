import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Save, Search, AlertCircle } from "lucide-react";
import purchaseApi from "../../api/purchase.api";
import supplierService from "../../api/supplier.service"; 
import productService from "../../api/product.service"; 

const PurchaseForm = ({ onClose, onSuccess }) => {
  // States
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    supplier: "",
    status: "Received",
    items: [{ 
      product: "", 
      productName: "", 
      quantity: 1, 
      buyingPrice: 0, 
      unit: "", 
      searchTerm: "" 
    }],
  });

  // ১. সাপ্লায়ার এবং প্রোডাক্ট লোড করা
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          supplierService.getAll({ limit: 1000, page: 1 }),
          productService.getAllProducts({ limit: 1000 })
        ]);

        const rawSuppliers = sRes.data?.data?.suppliers || sRes.data?.suppliers || sRes.data?.data || sRes.data || [];
        setSuppliers(Array.isArray(rawSuppliers) ? rawSuppliers : (rawSuppliers.docs || []));

        const rawProducts = pRes.data?.data?.products || pRes.data?.products || pRes.data?.data || pRes.data || [];
        setProducts(Array.isArray(rawProducts) ? rawProducts : (rawProducts.docs || []));

      } catch (err) {
        console.error("Critical error loading initial data:", err);
      }
    };
    fetchData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveSearchIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ২. ইনপুট হ্যান্ডলার (টাইপিং এর সময় ০ এর ঝামেলা ফিক্সড)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    
    if (field === "quantity" || field === "buyingPrice") {
      // যদি ইউজার ইনপুট একদম মুছে ফেলে তবে খালি রাখবে, নাহলে নাম্বার করবে
      updatedItems[index][field] = value === "" ? "" : Number(value);
    } else {
      updatedItems[index][field] = value;
    }

    setFormData({ ...formData, items: updatedItems });
  };

  // ৩. প্রোডাক্ট সিলেক্ট করা
  const selectProduct = (index, prod) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      product: prod._id,
      productName: prod.name,
      searchTerm: prod.name,
      unit: prod.unit?._id || prod.unit || "N/A",
      buyingPrice: prod.buyingPrice || 0,
      quantity: 1
    };
    setFormData({ ...formData, items: updatedItems });
    setActiveSearchIndex(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", productName: "", quantity: 1, buyingPrice: 0, unit: "", searchTerm: "" }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    }
  };

  // ৪. সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier) return alert("দয়া করে সাপ্লায়ার সিলেক্ট করুন!");
    
    // ভ্যালিডেশন
    const isInvalid = formData.items.some(item => !item.product || item.quantity === "" || item.quantity <= 0);
    if (isInvalid) return alert("সবগুলো ঘরে সঠিক প্রোডাক্ট এবং পরিমাণ দিন!");

    setLoading(true);
    try {
      await purchaseApi.createBulkPurchase(formData);
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">New Bulk Purchase</h3>
            <p className="text-xs text-gray-500">Stock ইনপুট করার জন্য ফর্মটি পূরণ করুন</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8">
          
          {/* Supplier & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Supplier</label>
              <select
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} {s.company ? `(${s.company})` : ""}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Received">Received</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-800">Products List</h4>
              <button type="button" onClick={addItem} className="text-indigo-600 font-bold flex items-center gap-1 text-sm bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition">
                <Plus size={18}/> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm relative group hover:border-indigo-300 transition-all">
                  
                  {/* Product Search */}
                  <div className="md:col-span-5 relative" ref={activeSearchIndex === index ? dropdownRef : null}>
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Product Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search product..."
                        className="w-full border p-2.5 pl-10 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        value={item.searchTerm}
                        onFocus={() => setActiveSearchIndex(index)}
                        onChange={(e) => handleItemChange(index, "searchTerm", e.target.value)}
                        required
                      />
                    </div>

                    {/* Search Results */}
                    {activeSearchIndex === index && (
                      <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {products
                          .filter(p => p.name.toLowerCase().includes(item.searchTerm.toLowerCase()))
                          .map(p => (
                            <div key={p._id} className="p-3 hover:bg-indigo-50 cursor-pointer border-b flex justify-between items-center transition" onClick={() => selectProduct(index, p)}>
                              <span className="text-sm font-bold text-gray-800">{p.name}</span>
                              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-bold">Stock: {p.stock || 0}</span>
                            </div>
                          ))}
                        {products.filter(p => p.name.toLowerCase().includes(item.searchTerm.toLowerCase())).length === 0 && (
                          <div className="p-3 text-center text-gray-400 text-sm">No product found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Qty</label>
                    <input 
                      type="number" 
                      className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition" 
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)} 
                      required 
                    />
                  </div>
                  
                  {/* Buying Price */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Unit Price</label>
                    <input 
                      type="number" 
                      className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition" 
                      value={item.buyingPrice} 
                      onChange={(e) => handleItemChange(index, "buyingPrice", e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Unit */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block">Unit</label>
                    <input className="w-full border p-2.5 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" value={item.unit} readOnly placeholder="---" />
                  </div>

                  {/* Action */}
                  <div className="md:col-span-1 flex items-end justify-center">
                    <button type="button" onClick={() => removeItem(index)} className="text-gray-400 p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="bg-gray-50 px-8 py-4 rounded-2xl border border-dashed border-gray-300 w-full md:w-auto">
              <p className="text-xs font-bold text-gray-500 uppercase">Grand Total</p>
              <p className="text-3xl font-black text-indigo-700">
                {formData.items.reduce((acc, curr) => acc + (Number(curr.quantity || 0) * Number(curr.buyingPrice || 0)), 0).toLocaleString()} <span className="text-sm font-medium text-gray-400">TK</span>
              </p>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button type="button" onClick={onClose} className="flex-1 md:flex-none px-8 py-3.5 border rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 md:flex-none px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg transition flex items-center justify-center gap-2">
                <Save size={20}/> {loading ? "Saving..." : "Confirm Purchase"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;