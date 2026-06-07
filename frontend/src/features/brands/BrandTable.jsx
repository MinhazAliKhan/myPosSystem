import React from "react";

const BrandTable = ({ brands, onEdit, onDelete, userRole }) => {
  if (brands.length === 0) return <p className="text-center py-4 bg-white rounded shadow">No brands found.</p>;

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {brands.map((brand) => (
            <tr key={brand._id} className="hover:bg-gray-50">
              <td className="p-3 font-medium">{brand.name}</td>
              <td className="p-3 text-sm text-gray-600">{brand.description || "-"}</td>
              <td className="p-3 text-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${brand.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {brand.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => onEdit(brand)} className="text-blue-600 hover:underline mr-3">Edit</button>
                {userRole === "ADMIN" && (
                  <button onClick={() => onDelete(brand._id)} className="text-red-600 hover:underline">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandTable;