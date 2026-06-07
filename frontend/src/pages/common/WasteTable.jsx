import React, { useState } from "react";
import { 
  Clock, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Layers,
  CalendarDays
} from "lucide-react";

const WasteTable = ({ data, totalPages, currentPage, onPageChange, limit, onLimitChange }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  // টাইমস্ট্যাম্প (সেকেন্ড পর্যন্ত) এবং ইউজার আইডি অনুযায়ী ডেটা গ্রুপ করা
  const groupedData = data.reduce((acc, item) => {
    const timeKey = new Date(item.createdAt).toISOString().slice(0, 19); 
    const userId = item.recordedBy?._id || 'system';
    const groupKey = `${timeKey}-${userId}`;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        date: new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        userName: item.recordedBy?.userName || "System",
        items: [],
        totalLoss: 0
      };
    }
    acc[groupKey].items.push(item);
    acc[groupKey].totalLoss += item.totalLossValue;
    return acc;
  }, {});

  const displayGroups = Object.values(groupedData);

  return (
    <div className="w-full flex flex-col h-[550px] bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="flex-grow overflow-y-auto px-4 py-2">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="bg-white sticky top-0 z-10">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-center">Batch Info</th>
              <th className="px-6 py-4 text-right">Total Loss</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {displayGroups.length > 0 ? (
              displayGroups.map((group, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedGroup(group)} 
                  className="bg-slate-50 hover:bg-indigo-50 cursor-pointer transition-all group"
                >
                  <td className="px-6 py-4 rounded-l-2xl border-l-4 border-l-transparent group-hover:border-l-indigo-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-500">
                        <CalendarDays size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{group.date}</span>
                        <span className="text-[9px] text-indigo-500 font-black flex items-center gap-1 uppercase">
                          <Clock size={10} /> {group.time}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                        <User size={12} className="text-indigo-500" />
                      </div>
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{group.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[9px] font-black rounded-lg uppercase shadow-sm">
                      {group.items.length} {group.items.length > 1 ? "Items" : "Item"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-700 text-sm italic">
                    ${group.totalLoss.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 rounded-r-2xl text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <ChevronRight size={20} />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-24 text-center text-slate-300 font-bold uppercase italic tracking-widest">No Records Found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Batch Detail Modal --- */}
      {selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">Waste Batch Details</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{selectedGroup.date} | {selectedGroup.time} | Recorded By {selectedGroup.userName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="overflow-hidden border border-slate-100 rounded-[2rem] shadow-sm bg-slate-50/30">
                <table className="w-full text-left">
                  <thead className="bg-white">
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4 text-right">Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedGroup.items.map((item, i) => (
                      <tr key={i} className="hover:bg-white transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-xs uppercase tracking-tighter">{item.product?.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">ID: {item._id.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-black text-indigo-600 text-xs bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                            {item.quantity} {item.unit?.name || "Unit"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-black rounded uppercase border border-rose-100">
                            {item.reason}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-700 text-xs">
                          {item.totalLossValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes Display */}
              <div className="mt-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Submission Notes</p>
                 <div className="space-y-2">
                    {selectedGroup.items.map((item, i) => item.note && (
                        <div key={i} className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                          <span className="font-black text-indigo-500 not-italic uppercase mr-2">{item.product?.name}:</span>
                          {item.note}
                        </div>
                    ))}
                    {!selectedGroup.items.some(i => i.note) && <p className="text-[11px] text-slate-400 italic">No notes found.</p>}
                 </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-12">
               <div>
                  <span className="block text-[10px] font-black text-slate-400 uppercase italic">Grand Total Loss</span>
                  <span className="text-2xl font-black text-rose-600 tracking-tighter italic">${selectedGroup.totalLoss.toLocaleString()}</span>
               </div>
               <button onClick={() => setSelectedGroup(null)} className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))} className="bg-white border border-slate-200 rounded-xl text-[10px] font-black px-3 py-2 outline-none shadow-sm cursor-pointer">
          <option value={10}>10 Rows</option>
          <option value={25}>25 Rows</option>
        </select>

        <div className="flex items-center gap-4">
          <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm disabled:opacity-20 hover:bg-slate-100">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 uppercase">Page {currentPage}</span>
            <span className="text-[10px] font-black text-slate-400 mx-1 uppercase">of</span>
            <span className="text-[10px] font-black text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">{totalPages}</span>
          </div>
          <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm disabled:opacity-20 hover:bg-slate-100">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteTable;