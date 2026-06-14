import React, { useState, useEffect } from "react";
import saleApi from "../../api/sale.service";

const KitchenOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await saleApi.getKitchenOrders();
      // কন্ট্রোলার থেকে আসা {success: true, data: [...]} ফরম্যাট অনুযায়ী ডাটা সেট করা
      if (res.data && Array.isArray(res.data.data)) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // বাটন ক্লিক করলে অর্ডারটি সার্ভারে আপডেট হবে এবং স্ক্রিন থেকে মুছে যাবে
  const handleRemoveOrder = async (orderId) => {
    try {
      await saleApi.markOrderDone(orderId);
      // লোকাল স্টেট থেকে সাথে সাথে সরিয়ে ফেলা হচ্ছে
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // প্রতি ৫ সেকেন্ডে অটো-রিফ্রেশ
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-bold text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white p-4 rounded-xl shadow-sm border-l-8 border-red-500 flex flex-col h-full"
            >
              {/* হেডার: আইডি ও সময় */}
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <span className="text-xl font-black text-gray-800">#{order._id.slice(-4)}</span>
                <span className="text-xs font-bold text-gray-400">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* খাবারের লিস্ট */}
              <div className="space-y-3 mb-6 flex-grow">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-700 uppercase">{item.name}</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-lg font-black">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Done বাটন - সবসময় নিচে থাকবে */}
              <button
                onClick={() => handleRemoveOrder(order._id)}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-black uppercase text-sm hover:bg-green-600 transition-all mt-auto"
              >
                Done
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400 font-black">
            NO ACTIVE ORDERS
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenOrderList;