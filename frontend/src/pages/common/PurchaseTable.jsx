import React from "react";

const PurchaseTable = ({ purchases, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 font-semibold text-gray-700">Supplier</th>
            <th className="p-4 font-semibold text-gray-700">Items</th>
            <th className="p-4 font-semibold text-gray-700">Total</th>
            <th className="p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {purchases.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-800">{p.supplier?.name || "N/A"}</td>
              <td className="p-4 text-sm text-gray-600">
                {p.items?.map((item, i) => (
                  <div key={i} className="mb-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                      {item.product?.name} × {item.quantity}
                    </span>
                  </div>
                ))}
              </td>
              <td className="p-4 font-semibold text-gray-800">
                ${Number(p.totalAmount || 0).toFixed(2)}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onEdit(p)} 
                    className="text-blue-600 hover:text-blue-800 font-medium transition text-sm px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(p._id)} 
                    className="text-red-600 hover:text-red-800 font-medium transition text-sm px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PurchaseTable;