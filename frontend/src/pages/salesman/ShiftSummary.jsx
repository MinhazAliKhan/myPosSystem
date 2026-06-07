import React, { useState, useEffect } from "react";
import saleApi from "../../api/sale.service";
import expenseApi from "../../api/expenseApi";
import { FaFire, FaMoneyBillWave } from "react-icons/fa";

const ShiftSummary = ({ shiftData }) => {
  const [topItems, setTopItems] = useState([]);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!shiftData?._id) return;

      try {
        setLoading(true);
        const [topRes, expenseRes] = await Promise.allSettled([
          saleApi.getTopItems(shiftData._id),
          expenseApi.getShiftStats(shiftData._id)
        ]);

        if (topRes.status === "fulfilled" && topRes.value.data?.data) {
          setTopItems(topRes.value.data.data);
        }

        if (expenseRes.status === "fulfilled" && expenseRes.value.data) {
          const resBody = expenseRes.value.data;
          const amount = resBody.totalExpense !== undefined ? resBody.totalExpense : 
                         resBody.data?.totalExpense !== undefined ? resBody.data.totalExpense : 
                         0;
          setExpenseAmount(Number(amount) || 0);
        } else {
          setExpenseAmount(0);
        }
      } catch (err) {
        console.error("Summary fetch error:", err);
        setExpenseAmount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shiftData?._id]);

  // ভ্যালু কনভার্ট করা
  const opening = Number(shiftData?.openingCash) || 0;
  const sales = Number(shiftData?.totalSales) || 0;
  const exp = Number(expenseAmount) || 0;
  const isOpen = shiftData?.status === "open";

  // ১. সিস্টেম অনুযায়ী কত টাকা ড্রয়ারে থাকার কথা
  const systemExpected = (opening + sales) - exp; 

  // ২. রিয়েল টাইম হ্যান্ড ক্যাশ লজিক:
  // শিফট ওপেন থাকলে সিস্টেমের হিসাবটাই হ্যান্ড ক্যাশ (যাতে ডিফারেন্স না দেখায়)
  // শিফট ক্লোজ হলে ডাটাবেজে থাকা আসল এন্ট্রি করা টাকা দেখাবে
  const actualHandCash = isOpen ? systemExpected : (Number(shiftData?.actualCashInDrawer) || 0);
  
  // ৩. ডিফারেন্স ক্যালকুলেশন
  const diff = actualHandCash - systemExpected;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Top 5 Items */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-4">
          <FaFire className="text-orange-500" />
          <h3 className="text-sm font-black text-gray-700 uppercase">
            {isOpen ? "Current Top 5" : "Shift Top 5"}
          </h3>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((n) => <div key={n} className="h-10 bg-gray-50 rounded-lg"></div>)}
            </div>
          ) : topItems.length > 0 ? (
            topItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                <span className="text-[11px] font-bold text-gray-600 uppercase truncate">
                  #{idx + 1} {item.productName}
                </span>
                <span className="text-[10px] font-black bg-white px-2 py-1 rounded shadow-sm">
                  {item.totalQty} Sold
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-gray-400 py-10 italic border-2 border-dashed border-gray-50 rounded-xl">
              No sales yet.
            </p>
          )}
        </div>
      </div>

      {/* Cash Integrity */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-4">
          <FaMoneyBillWave className="text-emerald-500" />
          <h3 className="text-sm font-black text-gray-700 uppercase">Cash Integrity</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
            <span>Opening:</span> <span className="text-gray-800">${opening.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
            <span>Sales:</span> <span className="text-emerald-600">+${sales.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
            <span>Expense:</span> <span className="text-rose-500">-${exp.toFixed(2)}</span>
          </div>

          <div className="border-t border-dashed my-2"></div>
          <div className="flex justify-between text-[11px] font-black text-gray-500">
            <span>Expected Cash:</span> <span>${systemExpected.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px] font-black text-blue-600">
            <span>Hand Cash:</span> <span className="bg-blue-50 px-2 rounded">${actualHandCash.toFixed(2)}</span>
          </div>

          {/* Status/Difference Card */}
          <div className={`mt-4 p-4 rounded-xl border flex justify-between items-center ${
            isOpen ? "bg-blue-50 border-blue-100" : diff === 0 ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
          }`}>
            <div>
              <p className="text-[9px] font-black uppercase opacity-60">{isOpen ? "Status" : "Difference"}</p>
              <h4 className="text-lg font-black">
                {isOpen ? "Running" : `$${Math.abs(diff).toFixed(2)}`}
              </h4>
            </div>
            <div className="text-[10px] font-black uppercase bg-white/60 px-2 py-1 rounded">
              {isOpen ? "Ongoing" : diff === 0 ? "Balanced" : diff < 0 ? "Short" : "Over"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummary;