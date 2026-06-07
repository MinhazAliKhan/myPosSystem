import React from "react";
import { useNavigate } from 'react-router-dom';

const ProductTable = ({ products, onEdit, onDelete, userRole }) => {
  const navigate = useNavigate();
  if (products.length === 0) return <p className="text-center py-4 bg-white rounded shadow">No products found.</p>;

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <div className="overflow-x-auto"> {/* ছোট স্ক্রিনের জন্য স্ক্রলিং সুবিধা */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3">Product Info</th>
              <th className="p-3">Category & Brand</th>
              <th className="p-3">Cost Price</th>
              <th className="p-3">Selling Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-red-50 transition-colors">
                {/* Product Name & SKU */}
                <td className="p-3">
                  <div className="font-bold text-gray-800">{p.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{p.sku || "NO SKU"}</div>
                </td>

                {/* Category & Brand */}
                <td className="p-3">
                  <div className="text-sm font-medium text-gray-700">{p.category?.name || "N/A"}</div>
                  <div className="text-[11px] text-gray-500">{p.brand?.name || "No Brand"}</div>
                </td>

                {/* Cost Price */}
                <td className="p-3">
                  <span className="text-sm text-gray-600 font-semibold">${p.costPrice.toFixed(2)} </span>
                </td>

                {/* Selling Price */}
                <td className="p-3">
                  <span className="text-sm text-blue-600 font-bold">${p.price.toFixed(2)}</span>
                </td>

                {/* Stock with Unit */}
                <td className="p-3">
                  <div className={`text-sm font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                    {p.stock} <span className="text-[10px] font-normal text-gray-500 uppercase">{p.unit?.shortName || p.unit?.name || 'Unit'}</span>
                  </div>
                  {p.stock <= 5 && <div className="text-[9px] text-red-400 italic">Low Stock</div>}
                </td>

                {/* Status Badge */}
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => navigate(`/admin/products/getProduct/${p._id}`)} 
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => onEdit(p)} 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>
                    {userRole === "ADMIN" && (
                      <button 
                        onClick={() => onDelete(p._id)} 
                        className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                      >
                        Delete
                      </button>
                    )}
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