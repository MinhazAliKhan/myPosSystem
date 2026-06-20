import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import refundApi from "../../../api/refund.service";
import RefundForm from "./RefundForm";
import RefundTable from "./RefundTable";
import { toast } from "react-hot-toast";

const RefundPage = () => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const refreshRefunds = async () => {
    try {
      setLoading(true);
      const res = await refundApi.getAllRefunds({ 
        page: currentPage, 
        limit: 10, 
        startDate: dateRange.start, 
        endDate: dateRange.end 
      });
      setRefunds(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) { toast.error("Error loading data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { refreshRefunds(); }, [currentPage, dateRange]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* হেডার: বাটনগুলো আরও ক্লিন */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-gray-500 hover:text-black transition flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
        <RefundForm onSave={refreshRefunds} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Refund Records</h1>
        <p className="text-gray-500 mt-1">Manage and view all product returns here.</p>
      </div>

      {/* ফিল্টার সেকশন: এখন আরও সুন্দর */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
        <div className="text-sm font-medium text-gray-700">Date Range:</div>
        <input 
          type="date" 
          className="text-sm border-gray-200 rounded-lg focus:ring-blue-500" 
          onChange={e => setDateRange(p => ({...p, start: e.target.value}))} 
        />
        <span className="text-gray-300">to</span>
        <input 
          type="date" 
          className="text-sm border-gray-200 rounded-lg focus:ring-blue-500" 
          onChange={e => setDateRange(p => ({...p, end: e.target.value}))} 
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading records...</div>
      ) : (
        <RefundTable refunds={refunds} />
      )}
      
      {/* পেজিনেশন */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">Showing {refunds.length} results</div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50">Previous</button>
          <button onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;