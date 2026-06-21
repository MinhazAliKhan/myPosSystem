import React, { useState } from "react";
import { toast } from "react-hot-toast";
import expenseApi from "../../api/expenseApi";

const ExpenseForm = ({ onSave }) => {
  const [formData, setFormData] = useState({ 
    category: 'Tea/Snacks', 
    amount: '', 
    note: '' 
  });
  const [isLoading, setIsLoading] = useState(false); // লোডিং স্টেট যোগ করা হলো

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amountVal = parseFloat(formData.amount);

    // ভ্যালিডেশন
    if (isNaN(amountVal) || amountVal <= 0) {
      return toast.error("Please enter a valid amount");
    }

    const payload = {
      expenses: [{
        category: formData.category,
        amount: amountVal,
        note: formData.note.trim() // অতিরিক্ত স্পেস রিমুভ করা
      }]
    };

    setIsLoading(true); // সাবমিট শুরু
    try {
      await expenseApi.create(payload);
      toast.success("Expense saved successfully!");
      
      // ফর্ম রিসেট
      setFormData({ category: 'Tea/Snacks', amount: '', note: '' });
      
      if (onSave) onSave(); // ডেটা রিফ্রেশ করার জন্য কল
    } catch (err) { 
      console.error("Submission Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save expense");
    } finally {
      setIsLoading(false); // সাবমিট শেষ
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
        <select 
          className="w-full p-2 border rounded-lg mt-1" 
          value={formData.category} 
          onChange={e => setFormData({...formData, category: e.target.value})}
        >
          {['Tea/Snacks', 'Transport', 'Cleaning', 'Utilities', 'Others'].map(c => 
            <option key={c} value={c}>{c}</option>
          )}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">Amount</label>
        <input 
          type="number" 
          required 
          step="any"
          className="w-full p-2 border rounded-lg mt-1" 
          value={formData.amount} 
          onChange={e => setFormData({...formData, amount: e.target.value})} 
        />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">Note</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded-lg mt-1" 
          value={formData.note} 
          onChange={e => setFormData({...formData, note: e.target.value})} 
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className={`py-2 rounded-lg font-bold text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};
export default ExpenseForm;