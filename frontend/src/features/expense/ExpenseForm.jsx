import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ExpenseForm = ({ isOpen, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState({
    amount: '', category: 'Tea/Snacks', description: '', date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        amount: editData.amount,
        category: editData.category,
        description: editData.description || '',
        date: new Date(editData.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({ amount: '', category: 'Tea/Snacks', description: '', date: new Date().toISOString().split('T')[0] });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative border">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 rounded-full transition-all">
          <X size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-800 uppercase mb-8 tracking-tighter italic">Add Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Amount</label>
            <input type="number" required autoFocus className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-black text-blue-600 text-xl focus:bg-white transition-all" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
              <select className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-xs focus:bg-white transition-all" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Tea/Snacks">Tea/Snacks</option>
                <option value="Transport">Transport</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Utilities">Utilities</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Date</label>
              <input type="date" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-xs focus:bg-white transition-all" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
            <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none text-xs h-24 resize-none focus:bg-white transition-all" placeholder="Reason..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-lg active:scale-95">
            Save Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;