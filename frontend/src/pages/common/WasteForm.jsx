import React, { useState, useEffect } from "react";
import api from "../../api/api";
import wasteApi from "../../api/waste.service";
import { toast } from "react-hot-toast";
import { Trash2, Send, Search, Loader2 } from "lucide-react";

const WasteForm = ({ onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/v1/products/getAllProducts"); 
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const searchLower = value.toLowerCase();

      // ১. যে প্রোডাক্টগুলো টাইপ করা অক্ষর দিয়ে শুরু হয়েছে (Priority 1)
      const startingMatch = products.filter(p => 
        p.name.toLowerCase().startsWith(searchLower)
      );

      // ২. যেগুলোর নামের মাঝখানে অক্ষর আছে কিন্তু শুরুতে নেই (Priority 2)
      const includesMatch = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) && 
        !p.name.toLowerCase().startsWith(searchLower)
      );

      // দুইটা লিস্ট একসাথে করে সেট করা যাতে সঠিক প্রোডাক্ট আগে থাকে
      setFilteredProducts([...startingMatch, ...includesMatch]);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectProduct = (prod) => {
    if (items.find(i => i.product === prod._id)) {
      return toast.error("এই প্রোডাক্টটি অলরেডি লিস্টে আছে");
    }
    
    setItems([{
      product: prod._id,
      name: prod.name,
      quantity: 1,
      unit: prod.unit?._id || prod.unit, 
      reason: "Expired",
      note: ""
    }, ...items]);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("অনুগ্রহ করে প্রোডাক্ট যোগ করুন");

    try {
      setLoading(true);
      const payload = { 
        items: items.map(i => ({
          product: i.product,
          quantity: Number(i.quantity),
          unit: i.unit,
          reason: i.reason,
          note: i.note || ""
        }))
      };

      const res = await wasteApi.recordBulkWaste(payload);
      
      if (res.data.success) {
        toast.success("Waste recorded and stock updated!");
        setItems([]);
        onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record waste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
      <div className="relative">
        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-4 italic">Search Product</label>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearch}
            placeholder="Search by product name..."
            className="w-full bg-slate-50 border-none rounded-3xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        {showDropdown && filteredProducts.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl max-h-64 overflow-y-auto p-2">
            {filteredProducts.map(p => (
              <div 
                key={p._id} 
                onClick={() => handleSelectProduct(p)} 
                className="p-4 hover:bg-indigo-50 cursor-pointer rounded-2xl border-b border-slate-50 last:border-0 transition-colors"
              >
                <p className="font-bold text-slate-700 text-sm uppercase">{p.name}</p>
                <p className="text-[10px] text-slate-400 font-bold">Current Stock: {p.stock}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-3 pt-2">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <div className="flex-grow font-black text-slate-700 text-xs uppercase pl-2">{item.name}</div>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min="1"
                  value={item.quantity} 
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = e.target.value;
                    setItems(newItems);
                  }}
                  className="w-20 bg-white border border-slate-200 rounded-xl p-2 text-center text-sm font-black shadow-sm"
                />
                <select 
                  value={item.reason}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].reason = e.target.value;
                    setItems(newItems);
                  }}
                  className="bg-white border border-slate-200 rounded-xl p-2 text-[10px] font-black uppercase outline-none shadow-sm"
                >
                  <option value="Expired">Expired</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Lost">Lost</option>
                  <option value="Theft">Theft</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="bg-slate-900 text-white px-12 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={16} /> Saving...</>
              ) : (
                <><Send size={16} /> Confirm Waste Record</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteForm;