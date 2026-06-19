import React from "react";

const PurchaseTable = ({ purchases, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4">Supplier</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {purchases.map((p) => (
            <tr key={p._id}>
              <td className="p-4">{p.supplier?.name || "N/A"}</td>
              <td className="p-4 text-sm">
                {p.items?.map((item, i) => (
                  <div key={i}>{item.product?.name} ({item.quantity})</div>
                ))}
              </td>
              <td className="p-4">${Number(p.totalAmount || 0).toFixed(2)}</td>
              <td className="p-4">
                <button onClick={() => onEdit(p)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => onDelete(p._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default PurchaseTable;