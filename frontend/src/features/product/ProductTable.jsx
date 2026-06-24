import React from "react";
import { useNavigate } from 'react-router-dom';

const ProductTable = ({ products, onEdit, onDelete, userRole }) => {
  const navigate = useNavigate();
  if (products.length === 0) return <p className="text-center py-4 bg-white rounded shadow">No products found.</p>;

  return (
    <div className="bg-white shadow rounded overflow-hidden w-full">
      <div className="overflow-x-auto w-full"> 
        <table className="w-full text-left border-collapse min-w-full">
          <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock (Alert Level)</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-gray-800">{p.name}</div>
                  <div className="text-[10px] text-gray-400">{p.sku}</div>
                </td>
                <td className="p-3 text-sm">{p.category?.name}</td>
                <td className="p-3 text-sm font-semibold">${p.costPrice?.toFixed(2)}</td>
                <td className="p-3 text-sm font-bold text-blue-600">${p.price?.toFixed(2)}</td>
                <td className="p-3">
                  <div className={`text-sm font-bold ${p.stock <= (p.lowStockLevel || 5) ? 'text-red-500' : 'text-gray-700'}`}>
                    {p.stock} <span className="text-[10px] font-normal text-gray-400">/ Alert at {p.lowStockLevel || 5}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => navigate(`/admin/products/getProduct/${p._id}`)} className="text-emerald-600 text-xs font-bold px-2">View</button>
                    <button onClick={() => onEdit(p)} className="text-blue-600 text-xs font-bold px-2">Edit</button>
                    {userRole === "ADMIN" && <button onClick={() => onDelete(p._id)} className="text-red-600 text-xs font-bold px-2">Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductTable;