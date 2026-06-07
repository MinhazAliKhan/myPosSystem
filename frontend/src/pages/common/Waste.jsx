import React, { useState, useEffect } from "react";
import WasteForm from "./WasteForm";
import WasteTable from "./WasteTable";
import wasteApi from "../../api/waste.service";
import { toast } from "react-hot-toast";

const Waste = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });
  const [limit, setLimit] = useState(10);

  const loadData = async (page = 1, currentLimit = 10) => {
    try {
      const res = await wasteApi.getWasteRecords({ 
        page: Number(page), 
        limit: Number(currentLimit) 
      });
      
      if (res.data.success) {
        // ব্যাকএন্ড থেকে সরাসরি res.data এর ভেতরে এই ফিল্ডগুলো আসছে
        const { data: wasteData, totalPages, currentPage } = res.data;
        
        setData(wasteData || []);
        setPagination({
          totalPages: totalPages || 1,
          currentPage: Number(currentPage) || page
        });
      }
    } catch (err) {
      console.error("Load error:", err);
      toast.error("Failed to load records");
    }
  };

  useEffect(() => {
    loadData(1, limit);
  }, [limit]);

  const handlePageChange = (newPage) => {
    loadData(newPage, limit);
  };

  return (
    <div className="p-6 space-y-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Waste Management</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Inventory Loss Control</p>
        </div>
        
        <WasteForm onSuccess={() => loadData(1, limit)} />
        
        <WasteTable 
          data={data}
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          onPageChange={handlePageChange}
          limit={limit}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            loadData(1, newLimit);
          }}
        />
      </div>
    </div>
  );
};

export default Waste;