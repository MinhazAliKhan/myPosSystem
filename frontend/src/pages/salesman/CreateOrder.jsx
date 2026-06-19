import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff, FaCashRegister, FaSearch, FaTrash, FaCog, FaBan, FaUndo, FaUserCircle, FaBackspace, FaCheckCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import productApi from "../../api/product.service";
import shiftApi from "../../api/shift.service";
import saleApi from "../../api/sale.service";
import { usePOS } from "./hooks/usePOS";
import { useAuth } from "../../store/AuthContext";

const CreateOrder = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ shift: null, drawer: null });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { cart, addToCart, removeFromCart, totalAmount, setCart } = usePOS();

  const changeAmount = Math.max(0, parseFloat(receivedAmount || 0) - totalAmount);

  const handleNumPad = (num) => setReceivedAmount((prev) => prev + num);
  const handleBackspace = () => setReceivedAmount((prev) => prev.slice(0, -1));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await shiftApi.getCurrentStatus();
        const { shift, drawers } = res.data.data;
        setStatus({ shift, drawer: drawers?.[0] || null });
        const prodRes = await productApi.getAllProducts({ isActive: true });
        setProducts(prodRes.data?.data || []);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const handlePay = async () => {
    if (cart.length === 0) return toast.error("Cart is empty!");
    if (!status.shift) return toast.error("No active shift!");
    if (parseFloat(receivedAmount) < totalAmount) return toast.error("Insufficient cash!");

    const saleData = {
      items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
      receivedAmount: parseFloat(receivedAmount),
      changeAmount: changeAmount,
      shiftId: status.shift._id
    };

    try {
      const res = await saleApi.createSale(saleData);
      if (res.data.success) {
        setShowModal(true);
        const prodRes = await productApi.getAllProducts({ isActive: true });
        setProducts(prodRes.data?.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to process sale");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCart([]);
    setReceivedAmount("");
  };

  const categories = ["All", ...new Set(products.map(p => 
    (p.category && typeof p.category === 'object' && p.category.name) ? p.category.name : "General"
  ))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const productCatName = (p.category && typeof p.category === 'object' && p.category.name) ? p.category.name : "General";
    const matchesCategory = selectedCategory === "All" || productCatName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 font-sans overflow-hidden">
      <Toaster />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-80 text-center">
            <FaCheckCircle className="text-emerald-500 mx-auto mb-4" size={50} />
            <h2 className="text-xl font-black text-slate-800 mb-6">Payment Successful</h2>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-400 font-bold text-xs uppercase">Received:</span>
              <span className="font-black text-sm">${parseFloat(receivedAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 mb-8">
              <span className="text-slate-400 font-bold text-xs uppercase">Change:</span>
              <span className="font-black text-rose-500 text-lg">${changeAmount.toFixed(2)}</span>
            </div>
            <button onClick={closeModal} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 uppercase text-xs">Done</button>
          </div>
        </div>
      )}

      <header className="h-16 bg-white px-8 flex justify-between items-center border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3 text-indigo-600 font-black tracking-widest uppercase text-xs">
          <FaCashRegister /> {status.shift ? "SHIFT ACTIVE" : "SHIFT CLOSED"}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
            <FaUserCircle className="text-indigo-500" size={20} />
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-800">{user?.userName || "User"}</p>
              <p className="text-[8px] font-bold uppercase text-indigo-500">{user?.role || "Staff"}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-rose-500 hover:text-rose-600"><FaPowerOff size={16} /></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="relative shrink-0">
            <FaSearch className="absolute left-4 top-4 text-slate-400" />
            <input type="text" placeholder="Search products..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-400 text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4 shrink-0">
            <button onClick={() => navigate("/salesman/manage")} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform flex flex-col items-center gap-2">
              <FaCog size={22} /> <span className="font-black uppercase text-[10px]">Manage</span>
            </button>
            <button onClick={() => navigate("/salesman/void")} className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform flex flex-col items-center gap-2">
              <FaBan size={22} /> <span className="font-black uppercase text-[10px]">Void</span>
            </button>
            <button onClick={() => navigate("/salesman/refund")} className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform flex flex-col items-center gap-2">
              <FaUndo size={22} /> <span className="font-black uppercase text-[10px]">Refund</span>
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
            {categories.map((cat, index) => (
              <button key={index} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-lg" : "bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 content-start">
            {filteredProducts.map((p) => (
              <button key={p._id} onClick={() => addToCart(p)} className="bg-white border-b-4 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 p-4 rounded-2xl transition-all shadow-sm flex flex-col items-center justify-center gap-2 h-28">
                <span className="text-[11px] font-bold text-slate-700 text-center uppercase">{p.name}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Stock: {p.stock}</span>
                <span className="text-[10px] font-black text-white bg-indigo-500 px-3 py-1 rounded-full">${p.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aside section with h-[45vh] for mobile/tablet to ensure controls are always visible */}
        <aside className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl flex flex-col h-[45vh] lg:h-full shadow-lg overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 font-black text-slate-400 uppercase text-[10px] shrink-0">Current Order</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <p className="text-[11px] font-bold text-slate-800">{item.name} <span className="text-indigo-500 font-black">x{item.quantity}</span></p>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[11px] font-black text-slate-700">${(item.price * item.quantity).toFixed(2)}</span>
                   <button onClick={() => removeFromCart(item.productId)} className="text-rose-400 hover:text-rose-600"><FaTrash size={12} /></button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <div className="space-y-2 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Total Amount</span>
                <span className="text-sm font-black text-slate-800">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1,2,3,4,5,6,7,8,9,".",0].map(n => (
                  <button key={n} onClick={() => handleNumPad(n.toString())} className="bg-white border border-slate-200 p-2 rounded-lg font-black text-slate-700 hover:bg-indigo-50 text-xs">{n}</button>
                ))}
                <button onClick={handleBackspace} className="bg-rose-50 text-rose-600 p-2 rounded-lg flex justify-center items-center text-xs"><FaBackspace/></button>
              </div>
              <div className="flex justify-between items-center border-t pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Received</span>
                <input type="text" value={receivedAmount} readOnly className="w-16 text-right bg-white border border-slate-300 rounded-lg p-1 text-[11px] font-black text-emerald-600" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Change</span>
                <span className="text-[11px] font-black text-rose-500">${changeAmount.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handlePay} disabled={!status.shift || cart.length === 0 || parseFloat(receivedAmount || 0) < totalAmount} className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase hover:shadow-xl transition-all ${!status.shift || parseFloat(receivedAmount || 0) < totalAmount ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"}`}>Pay Now</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateOrder;