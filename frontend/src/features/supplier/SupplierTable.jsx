import React from "react";

const SupplierTable = ({ suppliers, onEdit, onDelete, userRole }) => {
  if (suppliers.length === 0) 
    return <p className="text-center py-4 bg-white rounded shadow">No suppliers found.</p>;

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Contact Info</th>
              <th className="p-3">Contact Person</th>
              <th className="p-3">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {suppliers.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="p-3">
                  <div className="font-bold text-gray-800">{item.name}</div>
                  <div className="text-[10px] text-gray-400 uppercase">ID: {item._id.slice(-6)}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-medium">{item.phone}</div>
                  <div className="text-xs text-gray-500">{item.email || "No Email"}</div>
                </td>
                <td className="p-3 text-sm">{item.contactPerson || "-"}</td>
                <td className="p-3 text-sm text-gray-600">{item.address || "-"}</td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => onEdit(item)} 
                    className="text-blue-600 hover:underline mr-3 text-sm font-semibold"
                  >
                    Edit
                  </button>
                  {userRole === "ADMIN" && (
                    <button 
                      onClick={() => onDelete(item._id)} 
                      className="text-red-600 hover:underline text-sm font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;