import React from "react";

const ExpenseTable = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-200">
        No expenses found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b uppercase text-xs text-gray-500 text-left">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Salesman</th>
            <th className="px-6 py-4">Shift</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Note</th>
            <th className="px-6 py-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {expenses.map((doc) =>
            doc.expenses.map((item, index) => (
              <tr key={`${doc._id}-${index}`} className="hover:bg-gray-50">
                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                
                {/* Salesman Name: অবজেক্ট চেক করে নাম দেখাচ্ছি */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {doc.createdBy?.userName || "Admin"}
                </td>
                
                {/* Shift ID: অবজেক্ট হলে আইডি বের করছি, নাহলে N/A */}
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {doc.shift?._id 
                    ? doc.shift._id.toString().slice(-6) 
                    : (doc.shift ? doc.shift.toString().slice(-6) : "N/A")}
                </td>
                
                {/* Category */}
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                    {item.category}
                  </span>
                </td>
                
                {/* Note */}
                <td className="px-6 py-4 text-gray-600">
                  {item.note || "-"}
                </td>
                
                {/* Amount */}
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {Number(item.amount || 0).toLocaleString()} TK
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;