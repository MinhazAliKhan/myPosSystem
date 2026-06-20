import React from "react";

const RefundTable = ({ refunds }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs text-gray-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Salesman</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {refunds.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-600">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">
                {r.salesmanId?.userName || "N/A"}
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                {r.reason}
              </td>
              <td className="px-4 py-3 font-bold text-gray-800 text-right">
                ${Number(r.totalAmount || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default RefundTable;