import React, { useState, useEffect } from "react";
import saleApi from "../../api/sale.service";
import api from "../../api/api"; 
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaTrashAlt, FaBoxOpen, FaTimes, FaArrowLeft, FaRegClock, FaMoneyBillWave } from "react-icons/fa";

const CreateOrder = () => {
  const [activeShift, setActiveShift] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const initializePOS = async () => {
      try {
        const shiftRes = await saleApi.getCurrentShift();
        if (!shiftRes.data?.data) {
          toast.error("Please open a shift first!");
          return navigate("/salesman/dashboard");
        }
        setActiveShift(shiftRes.data.data);

        const [productRes, catRes] = await Promise.all([
          api.get("/v1/products/getAllProducts"),
          api.get("/v1/categories/getCategories")
        ]);

        setProducts(productRes.data.data || []);
        const categoryData = catRes.data?.data?.data || catRes.data?.data || [];
        setCategories(categoryData);
      } catch (err) {
        toast.error("Failed to load POS data!");
        navigate("/salesman/dashboard");
      } finally {
        setLoading(false);
      }
    };
    initializePOS();
  }, [navigate]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchTerm(""); 
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const productCatId = p.categoryId?._id || p.categoryId || p.category?._id || p.category;
    const matchesCategory = selectedCategory === "All" || String(productCatId) === String(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) return toast.error("Out of stock!");
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      setCart(cart.map(item => item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }]);
    }
    setSearchTerm(""); 
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const changeAmount = receivedAmount ? Math.max(0, parseFloat(receivedAmount) - totalAmount) : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty!");
    const cash = parseFloat(receivedAmount) || 0;
    if (cash < totalAmount) return toast.error("Insufficient cash!");

    try {
      const saleData = {
        shiftId: activeShift._id,
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
        receivedAmount: cash
      };
      await saleApi.createSale(saleData);
      toast.success("Transaction Successful!");
      setCart([]);
      setReceivedAmount("");
      setSearchTerm(""); 
      setSelectedCategory("All"); 
      const productRes = await api.get("/v1/products/getAllProducts");
      setProducts(productRes.data.data);
    } catch (err) {
      toast.error("Checkout failed");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0f172a] font-black text-red-500 animate-pulse uppercase tracking-[0.3em]">Initializing POS...</div>;

  return (
    // ফুল স্ক্রিন ডার্ক লেআউট
    <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col h-screen overflow-hidden">
      
      {/* ১. টপ বার ডিজাইন */}
      <header className="bg-[#1e293b] border-b border-white/5 px-6 py-3 flex items-center justify-between shrink-0 shadow-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/salesman/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-600/20"
          >
            <FaArrowLeft size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
          </button>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div>
            <h1 className="text-white text-lg font-black tracking-tight leading-none uppercase">POS System</h1>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Status: Active Shift</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <FaRegClock className="text-gray-400" size={12} />
          <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date().toLocaleDateString()}</span>
        </div>
      </header>

      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        
        {/* ২. প্রোডাক্ট এরিয়া */}
        <section className="flex-1 flex flex-col overflow-hidden">
          
          {/* সার্চ ও ক্যাটাগরি প্যানেল */}
          <div className="bg-[#1e293b] rounded-3xl p-5 mb-4 border border-white/5 shadow-2xl shrink-0">
            <div className="relative mb-4 group">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm} 
                className="w-full pl-12 pr-12 py-3.5 bg-black/20 border border-white/10 rounded-2xl focus:border-red-500 outline-none text-white text-[15px] font-medium transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"><FaTimes /></button>}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button 
                onClick={() => handleCategoryChange("All")}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === "All" ? "bg-red-600 text-white shadow-lg" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat._id ? "bg-red-600 text-white shadow-lg" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* প্রোডাক্ট গ্রিড */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
              {filteredProducts.map(product => (
                <div 
                  key={product._id} onClick={() => addToCart(product)}
                  className="bg-[#1e293b] p-4 rounded-[2rem] border border-white/5 hover:border-red-500/50 hover:shadow-2xl hover:shadow-black cursor-pointer transition-all duration-300 flex flex-col items-center group"
                >
                  <div className="w-20 h-20 bg-black/20 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FaBoxOpen className="text-gray-600 group-hover:text-red-500 text-4xl" />
                  </div>
                  <h4 className="text-[12px] font-bold text-gray-300 line-clamp-1 h-5 px-2 uppercase">{product.name}</h4>
                  <p className="text-red-500 font-black text-xl mt-1 tracking-tighter">${product.price.toFixed(2)}</p>
                  <span className="mt-3 text-[9px] font-black text-gray-500 uppercase bg-black/20 px-3 py-1 rounded-full border border-white/5">Stock: {product.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ৩. চিকন কার্ট প্যানেল (w-72) */}
        <aside className="w-72 bg-[#1e293b] rounded-[2.5rem] shadow-2xl flex flex-col border border-white/5 shrink-0 overflow-hidden">
          
          <div className="p-6 pb-4 flex items-center justify-between shrink-0 bg-black/10">
             <div className="flex items-center gap-2">
                <FaShoppingCart className="text-red-500" size={14}/>
                <h2 className="font-black text-white text-[10px] tracking-widest uppercase">Order Items</h2>
             </div>
             <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black">{cart.length}</span>
          </div>

          {/* কার্ট আইটেম লিস্ট */}
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar p-4 pt-4">
            {cart.map(item => (
              <div key={item.productId} className="flex flex-col bg-black/20 p-3 rounded-2xl border border-white/5">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold text-gray-300 line-clamp-1 flex-1 uppercase">{item.name}</p>
                  <button onClick={() => setCart(cart.filter(i => i.productId !== item.productId))} className="text-gray-600 hover:text-red-500 ml-2">
                    <FaTrashAlt size={10}/>
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[9px] text-gray-500 font-black uppercase">{item.quantity} x ${item.price}</p>
                  <span className="text-[12px] font-black text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ৪. চেকআউট সেকশন (আপনার অরিজিনাল লজিকসহ) */}
          <div className="bg-black/20 p-5 space-y-4 shrink-0 border-t border-white/5">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-white tracking-tighter">${totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <FaMoneyBillWave className="text-green-500" size={10} />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Cash Received</span>
              </div>
              <input 
                type="number" value={receivedAmount}
                className="w-full text-right text-2xl font-black p-3 bg-[#1e293b] rounded-xl border border-white/10 focus:border-green-500 outline-none text-green-500 shadow-inner"
                placeholder="0.00"
                onChange={(e) => setReceivedAmount(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Change</span>
              <span className="text-xl font-black text-red-500">${changeAmount.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
            >
              Confirm Transaction
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateOrder;