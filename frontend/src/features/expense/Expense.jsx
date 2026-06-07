import React, { useState, useEffect } from 'react';
import expenseApi from '../../api/expenseApi';
import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';
import { Plus, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const fetchExpenses = async () => {
    try {
      const response = await expenseApi.getAll({ search, startDate, endDate, page, limit: 10 });
      setExpenses(response.data.expenses || []);
      setPagination({ totalPages: response.data.totalPages || 1, currentPage: response.data.currentPage || 1 });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchExpenses(); }, [search, startDate, endDate, page]);

  const handleCreateOrUpdate = async (data) => {
    try {
      // আপনার আগের পেলোড স্ট্রাকচার ঠিক রাখা হয়েছে
      const payload = {
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date
      };

      if (editData) {
        await expenseApi.update(editData._id, payload);
      } else {
        // ব্যাকএন্ড এখন নিজেই শিফট আইডি খুঁজে নিবে, তাই এখান থেকে আর কিছু পাঠাতে হবে না
        await expenseApi.create(payload);
      }

      setIsModalOpen(false);
      setEditData(null);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm Delete?")) {
      try { await expenseApi.delete(id); fetchExpenses(); } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Store Expenses</h1>
          <button onClick={() => {setEditData(null); setIsModalOpen(true);}} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus size={18} /> New Expense
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm border items-end">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={16} />
            <input type="text" placeholder="Search..." className="pl-12 pr-4 py-3 w-full border border-gray-100 rounded-2xl outline-none text-xs bg-gray-50 focus:bg-white transition-all" value={search} onChange={(e) => {setSearch(e.target.value); setPage(1);}} />
          </div>
          <input type="date" className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none" value={startDate} onChange={(e) => {setStartDate(e.target.value); setPage(1);}} />
          <input type="date" className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none" value={endDate} onChange={(e) => {setEndDate(e.target.value); setPage(1);}} />
          <button onClick={() => {setSearch(''); setStartDate(''); setEndDate(''); setPage(1);}} className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 font-black text-[10px] bg-slate-50 p-3.5 rounded-2xl uppercase transition-all">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
      <ExpenseTable expenses={expenses} onEdit={(d) => {setEditData(d); setIsModalOpen(true);}} onDelete={handleDelete} isAdmin={isAdmin} />
      <div className="mt-8 flex justify-center items-center gap-3">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 bg-white rounded-2xl shadow-sm border disabled:opacity-20"><ChevronLeft size={18} /></button>
        <span className="text-[10px] font-black text-slate-500 uppercase">Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="p-3 bg-white rounded-2xl shadow-sm border disabled:opacity-20"><ChevronRight size={18} /></button>
      </div>
      <ExpenseForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateOrUpdate} editData={editData} isAdmin={isAdmin} />
    </div>
  );
};

export default Expense;