import React, { useState, useEffect } from "react";
import { Search, CreditCard, Package, Loader2, Trash2, Plus, Save, ChevronLeft, ChevronRight, Eye, X, Printer } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; 
import purchaseApi from "../../api/purchase.api"; 
import supplierService from "../../api/supplier.service";
import productService from "../../api/product.service";

const PurchasePage = () => {
  const [activeTab, setActiveTab] = useState("add"); 
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalQty: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    supplier: "",
    status: "Received",
    items: [{ product: "", quantity: 1, buyingPrice: 0, unit: "" }]
  });

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    supplier: ""
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [supRes, prodRes] = await Promise.all([
          supplierService.getAll({ limit: 1000 }),
          productService.getAllProducts({ limit: 1000 }) 
        ]);
        const sList = supRes.data?.data?.suppliers || supRes.data?.suppliers || supRes.data?.data || [];
        const pList = prodRes.data?.data?.products || prodRes.data?.products || prodRes.data?.data || [];
        setSuppliers(sList);
        setProducts(pList);
      } catch (err) { console.error("Data Load Error:", err); }
    };
    loadInitialData();
  }, []);

  const handlePrintBatch = (batchItems) => {
    const supplierName = batchItems[0]?.supplier?.name || "N/A";
    const date = new Date(batchItems[0]?.createdAt).toLocaleString();
    const total = batchItems.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Receipt - ${supplierName}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
            th { background: #f8f9fa; }
            .total { text-align: right; margin-top: 20px; font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header"><h1>PURCHASE RECEIPT</h1><p>Supplier: <strong>${supplierName}</strong></p><p>Date: ${date}</p></div>
          <table>
            <thead><tr><th>Product Name</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              ${batchItems.map(item => `<tr><td>${item.product?.name}</td><td>${item.quantity}</td><td>$${item.buyingPrice.toLocaleString()}</td><td>$${item.totalAmount.toLocaleString()}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="total">Total Amount: $${total.toLocaleString()}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === "quantity" || field === "buyingPrice") {
      newItems[index][field] = value === "" ? "" : Number(value);
    } else {
      newItems[index][field] = value;
    }
    if (field === "product") {
      const selectedProd = products.find(p => p._id === value);
      if (selectedProd) {
        newItems[index].unit = selectedProd.unit?._id || selectedProd.unit || "";
      }
    }
    setFormData({ ...formData, items: newItems });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: Number(item.quantity || 0),
          buyingPrice: Number(item.buyingPrice || 0)
        }))
      };
      const res = await purchaseApi.createBulkPurchase(payload);
      if (res.data.success) {
        toast.success("Purchase recorded successfully!"); 
        setFormData({ supplier: "", status: "Received", items: [{ product: "", quantity: 1, buyingPrice: 0, unit: "" }] });
        setActiveTab("report");
        handleSearch();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save purchase");
    } finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setCurrentPage(1);
    try {
      const res = await purchaseApi.getAllPurchases(filters);
      const resData = res.data?.data || res.data;
      let pList = resData.purchases || (Array.isArray(resData) ? resData : []);
      pList = pList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const totalAmt = pList.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
      const totalQ = pList.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
      setPurchases(pList);
      setSummary({ totalAmount: totalAmt, totalQty: totalQ });
    } catch (err) { 
      toast.error("Error fetching reports");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const res = await purchaseApi.deletePurchase(id);
        if (res.data.success) {
          toast.success("Deleted!");
          if (selectedBatch) setSelectedBatch(selectedBatch.filter(i => i._id !== id));
          handleSearch();
        }
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const groupedData = purchases.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    const timeKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    const key = `${timeKey}-${curr.supplier?._id}`;
    if (!acc[key]) {
      acc[key] = { id: key, createdAt: curr.createdAt, supplier: curr.supplier, items: [], totalAmountInBatch: 0 };
    }
    acc[key].items.push(curr);
    acc[key].totalAmountInBatch += Number(curr.totalAmount || 0);
    return acc;
  }, {});

  const groupedList = Object.values(groupedData);
  const totalPages = Math.ceil(groupedList.length / itemsPerPage);
  const currentBatchItems = groupedList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-black mb-6 flex items-center gap-2">
           <Package className="text-indigo-600"/> Procurement Manager
        </h1>

        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm w-fit border border-gray-100">
          <button onClick={() => setActiveTab("add")} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "add" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-indigo-600"}`}>Add Purchase</button>
          <button onClick={() => { setActiveTab("report"); handleSearch(); }} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === "report" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-indigo-600"}`}>Reports</button>
        </div>

        {activeTab === "add" ? (
          <div className="bg-white p-6 rounded-2xl border shadow-sm border-gray-100">
            <form onSubmit={handlePurchaseSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Supplier</label>
                  <select required className="w-full border p-3 rounded-xl font-bold bg-gray-50 outline-none" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Stock Status</label>
                  <select className="w-full border p-3 rounded-xl font-bold bg-gray-50" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="Received">Received (Stock +)</option>
                    <option value="Ordered">Ordered (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => {
                  const selectedProductInfo = products.find(p => p._id === item.product);
                  return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 items-end">
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] font-bold text-indigo-500 uppercase flex justify-between">Product {selectedProductInfo && <span>Stock: {selectedProductInfo.stock || 0}</span>}</label>
                        <select required className="w-full border p-2.5 rounded-lg font-bold bg-white outline-none" value={item.product} onChange={(e) => handleItemChange(index, "product", e.target.value)}>
                          <option value="">Choose Product</option>
                          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Qty</label>
                        <input type="number" className="w-full border p-2.5 rounded-lg font-black bg-white outline-none" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                      </div>
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Price ($)</label>
                        <input type="number" className="w-full border p-2.5 rounded-lg font-black bg-white outline-none text-indigo-600" value={item.buyingPrice} onChange={(e) => handleItemChange(index, "buyingPrice", e.target.value)} />
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-2">
                        <button type="button" onClick={() => formData.items.length > 1 && setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                      </div>
                    </div>
                  );
                })}
                <button type="button" onClick={() => setFormData({...formData, items: [...formData.items, { product: "", quantity: 1, buyingPrice: 0, unit: "" }]})} className="flex items-center gap-2 text-indigo-600 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-lg">
                  <Plus size={14}/> Add New Item
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full mt-10 bg-indigo-600 text-white p-4 rounded-xl font-black shadow-lg flex justify-center items-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20}/>}
                {loading ? "Saving..." : "Record Bulk Purchase"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1 text-gray-400"><label className="text-[10px] font-black uppercase px-1">From Date</label><input type="date" className="w-full border p-2.5 rounded-lg font-bold text-gray-700 outline-none" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} /></div>
              <div className="space-y-1 text-gray-400"><label className="text-[10px] font-black uppercase px-1">To Date</label><input type="date" className="w-full border p-2.5 rounded-lg font-bold text-gray-700 outline-none" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} /></div>
              <div className="space-y-1 text-gray-400"><label className="text-[10px] font-black uppercase px-1">Supplier</label><select className="w-full border p-2.5 rounded-lg font-bold text-gray-700 outline-none" value={filters.supplier} onChange={(e) => setFilters({...filters, supplier: e.target.value})}><option value="">All Suppliers</option>{suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 shadow-md transition-all"><Search size={18}/> Filter</button>
                <button type="button" onClick={() => setActiveTab("add")} className="bg-gray-100 text-gray-600 px-5 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg flex items-center justify-between">
                <div><p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Total Amount</p><h2 className="text-3xl font-black">${summary.totalAmount.toLocaleString()}</h2></div>
                <CreditCard size={40} className="opacity-20"/>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Qty</p><h2 className="text-3xl font-black text-gray-800">{summary.totalQty.toLocaleString()}</h2></div>
                <Package size={40} className="text-indigo-100"/>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr><th className="px-6 py-4">Time</th><th className="px-6 py-4">Supplier</th><th className="px-6 py-4 text-center">Items</th><th className="px-6 py-4 text-right">Total</th><th className="px-6 py-4 text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                  {currentBatchItems.length > 0 ? currentBatchItems.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4"><div className="flex flex-col leading-tight"><span>{new Date(batch.createdAt).toLocaleDateString()}</span><span className="text-[10px] text-indigo-500 font-black uppercase">{new Date(batch.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div></td>
                      <td className="px-6 py-4 uppercase font-black">{batch.supplier?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-center"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black">{batch.items.length} Items</span></td>
                      <td className="px-6 py-4 text-right font-black text-indigo-600">${batch.totalAmountInBatch.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                           <button onClick={() => setSelectedBatch(batch.items)} className="p-2 text-gray-400 hover:text-indigo-600 bg-gray-50 rounded-lg"><Eye size={18}/></button>
                           <button onClick={() => handlePrintBatch(batch.items)} className="p-2 text-gray-400 hover:text-green-600 bg-gray-50 rounded-lg"><Printer size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  )) : (<tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-black">No reports found.</td></tr>)}
                </tbody>
              </table>

              {/* PAGINATION BUTTONS - BACK AGAIN */}
              {groupedList.length > itemsPerPage && (
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Page {currentPage} of {totalPages}</span>
                  <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 bg-white border rounded-xl disabled:opacity-20 shadow-sm transition-all"><ChevronLeft size={20}/></button>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 bg-white border rounded-xl disabled:opacity-20 shadow-sm transition-all"><ChevronRight size={20}/></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- DETAIL MODAL WITH CANCEL --- */}
        {selectedBatch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <div><h2 className="text-lg font-black uppercase">Purchase Details</h2><p className="text-[10px] font-bold text-gray-400 tracking-widest">{new Date(selectedBatch[0]?.createdAt).toLocaleString()}</p></div>
                <div className="flex gap-2"><button onClick={() => handlePrintBatch(selectedBatch)} className="p-2 hover:bg-green-100 text-green-600 rounded-full transition-colors"><Printer size={20}/></button><button onClick={() => setSelectedBatch(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button></div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-gray-400 uppercase border-b pb-2">
                    <tr><th className="pb-3">Product</th><th className="pb-3 text-center">Qty</th><th className="pb-3 text-right">Price</th><th className="pb-3 text-right">Subtotal</th><th className="pb-3 text-center">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-bold">
                    {selectedBatch.map(item => (
                      <tr key={item._id} className="text-sm">
                        <td className="py-4">{item.product?.name}</td>
                        <td className="py-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-right">${item.buyingPrice?.toLocaleString()}</td>
                        <td className="py-4 text-right text-indigo-600">${item.totalAmount?.toLocaleString()}</td>
                        <td className="py-4 text-center"><button onClick={() => handleDelete(item._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setSelectedBatch(null)} className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all uppercase tracking-widest shadow-sm">Cancel</button>
              </div>
              <div className="p-6 bg-indigo-600 text-white flex justify-between items-center font-black">
                 <span className="text-xs uppercase opacity-70 tracking-widest font-black">Total Batch Amount</span>
                 <span className="text-xl">${selectedBatch.reduce((acc, c) => acc + (c.totalAmount || 0), 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;