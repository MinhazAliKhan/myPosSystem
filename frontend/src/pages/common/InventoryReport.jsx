import React, { useEffect, useState } from "react";
import inventoryReportApi from "../../api/inventoryReport.service";
import { toast } from "react-hot-toast";

const InventoryReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টারের জন্য সিম্পল স্টেট
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await inventoryReportApi.getInventoryReport();
      if (res?.data?.success) {
        setReports(res.data.data);
      }
    } catch (error) {
      toast.error("রিপোর্ট লোড করতে ব্যর্থ হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  // ফিল্টার অনুযায়ী ডাটা চেক করা
  const filteredData = reports.filter((item) => {
    if (filter === "ALL") return true;
    return item.inventoryStatus === filter;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Inventory Report</h2>

      {/* সহজ কার্ড বাটন */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setFilter("ALL")} className="bg-gray-800 text-white px-4 py-2 rounded">All</button>
        <button onClick={() => setFilter("OUT_OF_STOCK")} className="bg-red-500 text-white px-4 py-2 rounded">Out of Stock</button>
        <button onClick={() => setFilter("LOW_STOCK")} className="bg-yellow-500 text-white px-4 py-2 rounded">Low Stock</button>
      </div>

      {/* সহজ টেবিল */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border">Product Name</th>
              <th className="p-3 text-left border">Category</th>
              <th className="p-3 text-left border">Stock</th>
              <th className="p-3 text-left border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.category?.name || "N/A"}</td>
                <td className="p-3 border">{item.stock}</td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.inventoryStatus === "OUT_OF_STOCK" ? "bg-red-200" : 
                    item.inventoryStatus === "LOW_STOCK" ? "bg-yellow-200" : "bg-green-200"
                  }`}>
                    {item.inventoryStatus.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryReport;