import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPowerOff, FaCashRegister, FaSearch, FaTrash, FaCog, FaUserCircle, FaBackspace, FaCheckCircle } from "react-icons/fa";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-sm text-center">
            <FaCheckCircle className="text-emerald-500 mx-auto mb-4" size={50} />
            <h2 className="text-xl font-black text-slate-800 mb-6">Payment Successful</h2>
            <div className="flex justify-between py-2 border-b">
              <span className="text-slate-400 font-bold text-xs lg:text-sm uppercase">Received:</span>
              <span className="font-black text-sm lg:text-lg">${parseFloat(receivedAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 mb-8">
              <span className="text-slate-400 font-bold text-xs lg:text-sm uppercase">Change:</span>
              <span className="font-black text-rose-500 text-lg lg:text-2xl">${changeAmount.toFixed(2)}</span>
            </div>
            <button onClick={closeModal} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 uppercase text-xs lg:text-base">Done</button>
          </div>
        </div>
      )}

      <header className="h-14 bg-white px-4 flex justify-between items-center border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600 font-black tracking-widest uppercase text-[10px] lg:text-xs">
          <FaCashRegister /> {status.shift ? "SHIFT ACTIVE" : "SHIFT CLOSED"}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/salesman/manage")} className="flex items-center gap-1 text-[10px] lg:text-xs font-black text-indigo-600 uppercase">
             <FaCog /> Manage
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-rose-500"><FaPowerOff size={16} /></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 gap-3">
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <input type="text" placeholder="Search products..." className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm lg:text-base" onChange={(e) => setSearchTerm(e.target.value)} />
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat, index) => (
              <button key={index} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] lg:text-xs font-black uppercase whitespace-nowrap ${selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-white border text-slate-600"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 content-start pb-4">
            {filteredProducts.map((p) => (
              <button key={p._id} onClick={() => addToCart(p)} className="bg-white border-b-4 border-indigo-200 p-3 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 h-24 lg:h-32">
                <span className="text-[10px] lg:text-xs font-bold text-slate-700 text-center uppercase truncate w-full">{p.name}</span>
                <span className="text-[10px] lg:text-sm font-black text-white bg-indigo-500 px-3 py-1 rounded-full">${p.price}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl flex flex-col h-[45vh] lg:h-full shadow-lg overflow-hidden shrink-0">
          <div className="p-3 border-b font-black text-[10px] lg:text-xs uppercase text-slate-400">Current Order</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border">
                <p className="text-[11px] lg:text-sm font-bold">{item.name} <span className="text-indigo-500">x{item.quantity}</span></p>
                <div className="flex items-center gap-3">
                   <span className="text-[11px] lg:text-sm font-black">${(item.price * item.quantity).toFixed(2)}</span>
                   <button onClick={() => removeFromCart(item.productId)} className="text-rose-400"><FaTrash size={12} /></button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t bg-slate-50">
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-white p-2 rounded-lg border text-center">
                    <p className="text-[8px] lg:text-[10px] text-slate-400 uppercase font-black">Total</p>
                    <p className="text-xs lg:text-base font-black text-slate-800">${totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-white p-2 rounded-lg border text-center">
                    <p className="text-[8px] lg:text-[10px] text-slate-400 uppercase font-black">Received</p>
                    <p className="text-xs lg:text-base font-black text-emerald-600">${parseFloat(receivedAmount || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-2 rounded-lg border text-center col-span-2">
                    <p className="text-[8px] lg:text-[10px] text-slate-400 uppercase font-black">Change</p>
                    <p className="text-sm lg:text-lg font-black text-rose-500">${changeAmount.toFixed(2)}</p>
                </div>
            </div>
            <div className="grid grid-cols-6 gap-1 mb-2">
              {[1,2,3,4,5,6,7,8,9,0,"."].map(n => (
                <button key={n} onClick={() => handleNumPad(n.toString())} className="bg-white border p-2 rounded-lg font-bold text-xs lg:text-sm">{n}</button>
              ))}
              <button onClick={handleBackspace} className="bg-rose-50 text-rose-600 rounded-lg flex justify-center items-center"><FaBackspace/></button>
            </div>
            <button onClick={handlePay} disabled={!status.shift || cart.length === 0} className="w-full py-4 bg-emerald-600 text-white font-black text-xs lg:text-base uppercase rounded-xl">Pay Now</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateOrder;