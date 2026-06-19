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

      <header className="h-16 bg-white px-6 flex justify-between items-center border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3 text-indigo-600 font-black tracking-widest uppercase text-xs">
          <FaCashRegister /> {status.shift ? "SHIFT ACTIVE" : "SHIFT CLOSED"}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { logout(); navigate("/login"); }} className="text-rose-500 hover:text-rose-600"><FaPowerOff size={16} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Side: Products */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="relative shrink-0">
            <FaSearch className="absolute left-4 top-4 text-slate-400" />
            <input type="text" placeholder="Search products..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-400 text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            {["Manage", "Void", "Refund"].map((label, i) => (
              <button key={label} onClick={() => navigate(`/salesman/${label.toLowerCase()}`)} className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col items-center gap-1 hover:bg-slate-50">
                {i === 0 ? <FaCog/> : i === 1 ? <FaBan/> : <FaUndo/>}
                <span className="font-black uppercase text-[9px]">{label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 content-start">
            {filteredProducts.map((p) => (
              <button key={p._id} onClick={() => addToCart(p)} className="bg-white border-b-4 border-indigo-200 p-3 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 h-24">
                <span className="text-[10px] font-bold text-slate-700 text-center uppercase">{p.name}</span>
                <span className="text-[10px] font-black text-indigo-600">${p.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Cart Section (Optimized for iPad/Small Screen) */}
        <aside className="w-72 lg:w-80 bg-white border border-slate-200 rounded-3xl flex flex-col h-full shadow-lg overflow-hidden">
          <div className="p-4 border-b font-black text-slate-400 uppercase text-[10px] shrink-0">Current Order</div>
          
          {/* Cart Items List - Enabled scrolling for iPad */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="text-[11px] font-bold truncate pr-2">{item.name} <span className="text-indigo-500 font-black">x{item.quantity}</span></p>
                <div className="flex items-center gap-2 flex-shrink-0">
                   <span className="text-[11px] font-black">${(item.price * item.quantity).toFixed(2)}</span>
                   <button onClick={() => removeFromCart(item.productId)} className="text-rose-400"><FaTrash size={10} /></button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Controls */}
          <div className="p-4 border-t bg-slate-50 shrink-0">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase">Total</span>
              <span className="text-sm font-black text-slate-800">${totalAmount.toFixed(2)}</span>
            </div>
            
            {/* Reduced size NumPad for better fit */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              {[1,2,3,4,5,6,7,8,9,".",0].map(n => (
                <button key={n} onClick={() => handleNumPad(n.toString())} className="bg-white border p-2 rounded-lg text-sm font-black">{n}</button>
              ))}
              <button onClick={handleBackspace} className="bg-rose-50 text-rose-600 p-2 rounded-lg flex justify-center items-center"><FaBackspace/></button>
            </div>
            
            <button onClick={handlePay} disabled={!status.shift || cart.length === 0} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-xs uppercase">Pay Now</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateOrder;