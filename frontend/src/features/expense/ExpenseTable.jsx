import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ExpenseTable = ({ expenses, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-gray-100">
            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Added By</th>
            {isAdmin && <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {expenses.map((item) => (
            <tr key={item._id} className="hover:bg-blue-50/10 transition-all">
              <td className="p-5 text-xs font-bold text-slate-600">{new Date(item.date).toLocaleDateString('en-GB')}</td>
              <td className="p-5"><span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase text-slate-500">{item.category}</span></td>
              <td className="p-5 text-sm font-black text-slate-800">{Number(item.amount).toLocaleString()} TK</td>
              <td className="p-5 text-center">
                {item.isFromRegister ? (
                  <span className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md text-[9px] font-black uppercase border border-orange-100">Register</span>
                ) : (
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-[9px] font-black uppercase border border-blue-100">Admin</span>
                )}
              </td>
              <td className="p-5">
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-black text-slate-700 uppercase">{item.createdBy?.userName || "N/A"}</span>
                </div>
              </td>
              {isAdmin && (
                <td className="p-5">
                  <div className="flex justify-center gap-2 transition-all">
                    <button onClick={() => onEdit(item)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg shadow-sm border border-blue-50"><Edit size={16}/></button>
                    <button onClick={() => onDelete(item._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg shadow-sm border border-red-50"><Trash2 size={16}/></button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;