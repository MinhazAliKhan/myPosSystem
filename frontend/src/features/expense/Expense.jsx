import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import expenseApi from "../../api/expenseApi";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";
import { toast } from "react-hot-toast";

const Expense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const refreshExpenses = async () => {
    try {
      setLoading(true);
      // ব্যাকএন্ডের ভ্যালিডেশন অনুযায়ী পেজ এবং লিমিট সংখ্যা হিসেবে পাঠানো
      const params = {
        page: parseInt(currentPage) || 1,
        limit: 10
      };
      
      const res = await expenseApi.getAll(params);
      
      // ব্যাকএন্ডের রেসপন্স স্ট্রাকচার অনুযায়ী ডেটা সেট করা
      setExpenses(res.data?.data || []);
    } catch (err) {
      console.error("Error details:", err.response?.data);
      toast.error(err.response?.data?.message || "Error loading expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    refreshExpenses(); 
  }, [currentPage]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-black">← Back</button>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Store Expenses</h1>
      </div>

      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <ExpenseForm onSave={refreshExpenses} />
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : (
        <ExpenseTable expenses={expenses} />
      )}
    </div>
  );
};
export default Expense;