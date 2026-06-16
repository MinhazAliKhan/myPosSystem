import React, { useState, useEffect } from "react";
import purchaseApi from "../../api/purchase.api";

const PurchaseTable = ({ refresh }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseApi.getAllPurchases().then(res => {
      // API থেকে ডাটা সেট করা হচ্ছে
      setPurchases(res.data.data || []);
      setLoading(false);
    });
  }, [refresh]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Purchases...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Supplier</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Products</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Total</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {purchases.length > 0 ? (
            purchases.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                {/* সাপ্লায়ারের নাম */}
                <td className="p-4 text-sm font-medium text-gray-800">
                  {p.supplier?.name || "N/A"}
                </td>
                
                {/* প্রোডাক্ট কলাম */}
                <td className="p-4 text-sm">
                  {p.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 mb-1">
                      <span className="font-semibold text-blue-700">
                        {item.product?.name || "Unknown"}
                      </span>
                      <span className="text-gray-500">
                        ({item.quantity} x ${Number(item.buyingPrice).toFixed(2)})
                      </span>
                    </div>
                  ))}
                </td>
                
                {/* টোটাল অ্যামাউন্ট */}
                <td className="p-4 text-sm font-bold text-indigo-600 font-mono">
                  ${Number(p.totalAmount).toFixed(2)}
                </td>
                
                {/* তারিখ */}
                <td className="p-4 text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-10 text-center text-gray-400">
                No purchase records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;